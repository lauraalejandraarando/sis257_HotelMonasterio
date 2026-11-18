
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Reserva } from '../entities/reserva.entity';
import { DetalleReserva } from '../entities/detalle-reserva.entity';
import { Huesped } from '../entities/huesped.entity';
import { Habitacion } from '../entities/habitacion.entity';

import { PagosService } from '../pagos/pagos.service';

import { CrearReservaDto } from './crear-reserva.dto';
import { ActualizarReservaDto } from './actualizar-reserva.dto';

@Injectable()
export class ReservasService {
  constructor(
    @InjectRepository(Reserva)
    private readonly reservasRepository: Repository<Reserva>,

    @InjectRepository(DetalleReserva)
    private readonly detallesReservaRepository: Repository<DetalleReserva>,

    private readonly dataSource: DataSource,

    private readonly pagosService: PagosService,
  ) {}

  // Consultar todas las reservas
  async obtenerTodas(): Promise<Reserva[]> {
    return this.reservasRepository.find({
      relations: {
        huesped: true,
        detalles: {
          habitacion: {
            tipoHabitacion: true,
          },
        },
      },
      order: {
        id: 'ASC',
      },
    });
  }

  // Consultar una reserva por su ID
  async obtenerPorId(id: number): Promise<Reserva> {
    const reserva = await this.reservasRepository.findOne({
      where: { id },
      relations: {
        huesped: true,
        detalles: {
          habitacion: {
            tipoHabitacion: true,
          },
        },
      },
    });

    if (!reserva) {
      throw new NotFoundException('Reserva no encontrada');
    }

    return reserva;
  }

  // Crear una reserva con varias habitaciones
  async crear(dto: CrearReservaDto): Promise<Reserva> {
    const formatoFecha = /^\d{4}-\d{2}-\d{2}$/;

    if (
      !formatoFecha.test(dto.fechaEntrada) ||
      !formatoFecha.test(dto.fechaSalida)
    ) {
      throw new BadRequestException(
        'Las fechas deben tener el formato YYYY-MM-DD',
      );
    }

    if (dto.fechaEntrada >= dto.fechaSalida) {
      throw new BadRequestException(
        'La fecha de salida debe ser posterior a la fecha de entrada',
      );
    }

    const reservaId = await this.dataSource.transaction(
      async (manager) => {
        const huespedRepository = manager.getRepository(Huesped);
        const habitacionesRepository = manager.getRepository(Habitacion);
        const reservasRepository = manager.getRepository(Reserva);
        const detallesRepository = manager.getRepository(DetalleReserva);

        // Verificar que el huÃ©sped exista y estÃ© activo
        const huesped = await huespedRepository.findOne({
          where: {
            id: dto.huespedId,
            estado: true,
          },
        });

        if (!huesped) {
          throw new NotFoundException(
            'El huÃ©sped no existe o estÃ¡ inactivo',
          );
        }

        // Ordenar los IDs para bloquear las habitaciones
        const habitacionesIds = [...dto.habitacionesIds].sort(
          (a, b) => a - b,
        );

        // Bloquear las habitaciones durante la transacciÃ³n
        const habitaciones = await habitacionesRepository
          .createQueryBuilder('habitacion')
          .leftJoinAndSelect(
            'habitacion.tipoHabitacion',
            'tipoHabitacion',
          )
          .where('habitacion.id IN (:...ids)', {
            ids: habitacionesIds,
          })
          .orderBy('habitacion.id', 'ASC')
          .setLock('pessimistic_write', undefined, ['habitacion'])
          .getMany();

        if (habitaciones.length !== habitacionesIds.length) {
          throw new NotFoundException(
            'Una o mÃ¡s habitaciones no existen',
          );
        }

        // Verificar estado y tipo de habitaciÃ³n
        for (const habitacion of habitaciones) {
          if (habitacion.estado !== 'disponible') {
            throw new ConflictException(
              `La habitaciÃ³n ${habitacion.numero} no estÃ¡ disponible`,
            );
          }

          if (!habitacion.tipoHabitacion.activo) {
            throw new BadRequestException(
              `El tipo de habitaciÃ³n ${habitacion.numero} estÃ¡ inactivo`,
            );
          }
        }

        // Comprobar capacidad total
        const capacidadTotal = habitaciones.reduce(
          (total, habitacion) =>
            total + habitacion.tipoHabitacion.capacidad,
          0,
        );

        if (dto.cantidadHuespedes > capacidadTotal) {
          throw new BadRequestException(
            'La capacidad de las habitaciones es insuficiente',
          );
        }

        // Comprobar reservas que se crucen con las fechas solicitadas
        const reservasEnConflicto = await detallesRepository
          .createQueryBuilder('detalle')
          .innerJoin('detalle.reserva', 'reserva')
          .innerJoin('detalle.habitacion', 'habitacion')
          .where('habitacion.id IN (:...ids)', {
            ids: habitacionesIds,
          })
          .andWhere('reserva.fechaEntrada < :fechaSalida', {
            fechaSalida: dto.fechaSalida,
          })
          .andWhere('reserva.fechaSalida > :fechaEntrada', {
            fechaEntrada: dto.fechaEntrada,
          })
          .andWhere('reserva.estado != :cancelada', {
            cancelada: 'cancelada',
          })
          .getCount();

        if (reservasEnConflicto > 0) {
          throw new ConflictException(
            'Una o mÃ¡s habitaciones ya tienen una reserva para esas fechas',
          );
        }

        // Generar cÃ³digo de reserva
        const codigoReserva =
          `RES-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // Crear la reserva principal
        const nuevaReserva = reservasRepository.create({
          codigoReserva,
          fechaEntrada: dto.fechaEntrada,
          fechaSalida: dto.fechaSalida,
          cantidadHuespedes: dto.cantidadHuespedes,
          estado: 'pendiente',
          observaciones: dto.observaciones,
          fechaLimitePago: new Date(
            Date.now() + 2 * 60 * 60 * 1000,
          ),
          huesped,
        });

        const reservaGuardada = await reservasRepository.save(
          nuevaReserva,
        );

        // Crear los detalles de las habitaciones
        const detalles = habitaciones.map((habitacion) =>
          detallesRepository.create({
            reserva: reservaGuardada,
            habitacion,
            precioNoche: Number(
              habitacion.tipoHabitacion.precioNoche,
            ),
          }),
        );

        await detallesRepository.save(detalles);

        return reservaGuardada.id;
      },
    );

    return this.obtenerPorId(reservaId);
  }

  // Actualizar una reserva existente
  async actualizar(
    id: number,
    dto: ActualizarReservaDto,
  ): Promise<Reserva> {
    const formatoFecha = /^\d{4}-\d{2}-\d{2}$/;

    // Procesar las cancelaciones mediante el mÃ³dulo de pagos
    if (dto.estado === 'cancelada') {
      await this.pagosService.cancelarReserva(
        id,
        dto.observaciones,
      );

      return this.obtenerPorId(id);
    }

    await this.dataSource.transaction(async (manager) => {
      const reservasRepository = manager.getRepository(Reserva);
      const huespedRepository = manager.getRepository(Huesped);
      const habitacionesRepository = manager.getRepository(Habitacion);
      const detallesRepository = manager.getRepository(DetalleReserva);

      // Buscar la reserva
      const reserva = await reservasRepository.findOne({
        where: { id },
        relations: {
          huesped: true,
          detalles: {
            habitacion: true,
          },
        },
      });

      if (!reserva) {
        throw new NotFoundException('Reserva no encontrada');
      }

      // No permitir modificar reservas canceladas
      if (reserva.estado === 'cancelada') {
        throw new BadRequestException(
          'No se puede modificar una reserva cancelada',
        );
      }

      // Una reserva confirmada no puede volver a pendiente
      if (
        reserva.estado === 'confirmada' &&
        dto.estado === 'pendiente'
      ) {
        throw new BadRequestException(
          'Una reserva confirmada no puede volver al estado pendiente',
        );
      }

      // La confirmaciÃ³n se realizarÃ¡ desde el mÃ³dulo de pagos
      if (dto.estado === 'confirmada') {
        throw new BadRequestException(
          'La reserva se confirmarÃ¡ automÃ¡ticamente al registrar el anticipo mÃ­nimo del 50 %',
        );
      }

      // Conservar las fechas actuales si no se envÃ­an nuevas
      const fechaEntrada =
        dto.fechaEntrada ?? reserva.fechaEntrada;

      const fechaSalida =
        dto.fechaSalida ?? reserva.fechaSalida;

      if (
        !formatoFecha.test(fechaEntrada) ||
        !formatoFecha.test(fechaSalida)
      ) {
        throw new BadRequestException(
          'Las fechas deben tener el formato YYYY-MM-DD',
        );
      }

      if (fechaEntrada >= fechaSalida) {
        throw new BadRequestException(
          'La fecha de salida debe ser posterior a la fecha de entrada',
        );
      }

      // Verificar que el huÃ©sped exista y estÃ© activo
      const huespedId = dto.huespedId ?? reserva.huesped.id;

      const huesped = await huespedRepository.findOne({
        where: {
          id: huespedId,
          estado: true,
        },
      });

      if (!huesped) {
        throw new NotFoundException(
          'El huÃ©sped no existe o estÃ¡ inactivo',
        );
      }

      // Conservar las habitaciones actuales si no se envÃ­an nuevas
      const habitacionesIds = (
        dto.habitacionesIds ??
        reserva.detalles.map(
          (detalle) => detalle.habitacion.id,
        )
      ).sort((a, b) => a - b);

      if (habitacionesIds.length === 0) {
        throw new BadRequestException(
          'La reserva debe tener al menos una habitaciÃ³n',
        );
      }

      // Buscar y bloquear las habitaciones
      const habitaciones = await habitacionesRepository
        .createQueryBuilder('habitacion')
        .leftJoinAndSelect(
          'habitacion.tipoHabitacion',
          'tipoHabitacion',
        )
        .where('habitacion.id IN (:...ids)', {
          ids: habitacionesIds,
        })
        .orderBy('habitacion.id', 'ASC')
        .setLock('pessimistic_write', undefined, ['habitacion'])
        .getMany();

      if (habitaciones.length !== habitacionesIds.length) {
        throw new NotFoundException(
          'Una o mÃ¡s habitaciones no existen',
        );
      }

      // Verificar estado y tipo de habitaciÃ³n
      for (const habitacion of habitaciones) {
        if (habitacion.estado !== 'disponible') {
          throw new ConflictException(
            `La habitaciÃ³n ${habitacion.numero} no estÃ¡ disponible`,
          );
        }

        if (!habitacion.tipoHabitacion.activo) {
          throw new BadRequestException(
            `El tipo de habitaciÃ³n ${habitacion.numero} estÃ¡ inactivo`,
          );
        }
      }

      // Comprobar capacidad total
      const cantidadHuespedes =
        dto.cantidadHuespedes ?? reserva.cantidadHuespedes;

      const capacidadTotal = habitaciones.reduce(
        (total, habitacion) =>
          total + habitacion.tipoHabitacion.capacidad,
        0,
      );

      if (cantidadHuespedes > capacidadTotal) {
        throw new BadRequestException(
          'La capacidad de las habitaciones es insuficiente',
        );
      }

      // Comprobar que no existan reservas cruzadas
      const reservasEnConflicto = await detallesRepository
        .createQueryBuilder('detalle')
        .innerJoin('detalle.reserva', 'reserva')
        .innerJoin('detalle.habitacion', 'habitacion')
        .where('habitacion.id IN (:...ids)', {
          ids: habitacionesIds,
        })
        .andWhere('reserva.id != :id', { id })
        .andWhere('reserva.fechaEntrada < :fechaSalida', {
          fechaSalida,
        })
        .andWhere('reserva.fechaSalida > :fechaEntrada', {
          fechaEntrada,
        })
        .andWhere('reserva.estado != :cancelada', {
          cancelada: 'cancelada',
        })
        .getCount();

      if (reservasEnConflicto > 0) {
        throw new ConflictException(
          'Una o mÃ¡s habitaciones ya tienen una reserva para esas fechas',
        );
      }

      // Actualizar los datos principales
      reserva.fechaEntrada = fechaEntrada;
      reserva.fechaSalida = fechaSalida;
      reserva.cantidadHuespedes = cantidadHuespedes;
      reserva.huesped = huesped;
      reserva.observaciones =
        dto.observaciones ?? reserva.observaciones;

      await reservasRepository.save(reserva);

      // Modificar los detalles solamente si se enviaron nuevas habitaciones
      if (dto.habitacionesIds !== undefined) {
        const detallesAnteriores = reserva.detalles;

        await detallesRepository.delete({
          reserva: { id },
        });

        const nuevosDetalles = habitaciones.map((habitacion) => {
          const detalleAnterior = detallesAnteriores.find(
            (detalle) =>
              detalle.habitacion.id === habitacion.id,
          );

          return detallesRepository.create({
            reserva,
            habitacion,
            precioNoche: detalleAnterior
              ? detalleAnterior.precioNoche
              : Number(habitacion.tipoHabitacion.precioNoche),
          });
        });

        await detallesRepository.save(nuevosDetalles);
      }
    });

    return this.obtenerPorId(id);
  }

// Modificado por Brayan: realizar check-in
async realizarCheckIn(id: number): Promise<Reserva> {
  await this.dataSource.transaction(async (manager) => {
    const reservasRepo = manager.getRepository(Reserva);
    const habitacionesRepo = manager.getRepository(Habitacion);
    const detallesRepo = manager.getRepository(DetalleReserva);

    const reserva = await reservasRepo.findOne({
      where: { id },
      lock: { mode: 'pessimistic_write' },
    });

    if (!reserva) {
      throw new NotFoundException('Reserva no encontrada');
    }

    if (reserva.estado !== 'confirmada') {
      throw new BadRequestException(
        'Solo se puede realizar check-in de una reserva confirmada',
      );
    }

    const detalles = await detallesRepo.find({
      where: { reserva: { id } },
      relations: { habitacion: true },
    });

    if (detalles.length === 0) {
      throw new BadRequestException(
        'La reserva no tiene habitaciones asignadas',
      );
    }

    for (const detalle of detalles) {
      const habitacion = await habitacionesRepo.findOne({
        where: { id: detalle.habitacion.id },
        lock: { mode: 'pessimistic_write' },
      });

      if (!habitacion || habitacion.estado !== 'disponible') {
        throw new ConflictException(
          'Una o más habitaciones no están disponibles',
        );
      }

      habitacion.estado = 'ocupada';
      await habitacionesRepo.save(habitacion);
    }

    reserva.estado = 'en curso';
    await reservasRepo.save(reserva);
  });

  return this.obtenerPorId(id);
}

// Modificado por Brayan: realizar check-out
async realizarCheckOut(id: number): Promise<Reserva> {
  await this.dataSource.transaction(async (manager) => {
    const reservasRepo = manager.getRepository(Reserva);
    const habitacionesRepo = manager.getRepository(Habitacion);
    const detallesRepo = manager.getRepository(DetalleReserva);

    const reserva = await reservasRepo.findOne({
      where: { id },
      lock: { mode: 'pessimistic_write' },
    });

    if (!reserva) {
      throw new NotFoundException('Reserva no encontrada');
    }

    if (reserva.estado !== 'en curso') {
      throw new BadRequestException(
        'Solo se puede realizar check-out de reservas en curso',
      );
    }

    const detalles = await detallesRepo.find({
      where: { reserva: { id } },
      relations: { habitacion: true },
    });

    if (detalles.length === 0) {
      throw new BadRequestException(
        'La reserva no tiene habitaciones asignadas',
      );
    }

    for (const detalle of detalles) {
      const habitacion = await habitacionesRepo.findOne({
        where: { id: detalle.habitacion.id },
        lock: { mode: 'pessimistic_write' },
      });

      if (!habitacion || habitacion.estado !== 'ocupada') {
        throw new ConflictException(
          'Una o más habitaciones no están ocupadas',
        );
      }

      habitacion.estado = 'disponible';
      await habitacionesRepo.save(habitacion);
    }

    reserva.estado = 'finalizada';
    await reservasRepo.save(reserva);
  });

  return this.obtenerPorId(id);
}
}

