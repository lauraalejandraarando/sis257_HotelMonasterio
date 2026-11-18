
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

        // Verificar que el huésped exista y esté activo
        const huesped = await huespedRepository.findOne({
          where: {
            id: dto.huespedId,
            estado: true,
          },
        });

        if (!huesped) {
          throw new NotFoundException(
            'El huésped no existe o está inactivo',
          );
        }

        // Ordenar los IDs para bloquear las habitaciones
        const habitacionesIds = [...dto.habitacionesIds].sort(
          (a, b) => a - b,
        );

        // Bloquear las habitaciones durante la transacción
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
            'Una o más habitaciones no existen',
          );
        }

        // Verificar estado y tipo de habitación
        for (const habitacion of habitaciones) {
          if (habitacion.estado !== 'disponible') {
            throw new ConflictException(
              `La habitación ${habitacion.numero} no está disponible`,
            );
          }

          if (!habitacion.tipoHabitacion.activo) {
            throw new BadRequestException(
              `El tipo de habitación ${habitacion.numero} está inactivo`,
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
            'Una o más habitaciones ya tienen una reserva para esas fechas',
          );
        }

        // Generar código de reserva
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

      // Las reservas confirmadas requieren el proceso de penalización
      if (
        reserva.estado === 'confirmada' &&
        dto.estado === 'cancelada'
      ) {
        throw new BadRequestException(
          'Las reservas confirmadas deben cancelarse mediante el proceso de penalización del módulo de pagos',
        );
      }

      // Procesar la cancelación de una reserva pendiente
      if (dto.estado === 'cancelada') {
        reserva.estado = 'cancelada';

        if (dto.observaciones !== undefined) {
          reserva.observaciones = dto.observaciones;
        }

        await reservasRepository.save(reserva);
        return;
      }

      // La confirmación se realizará desde el módulo de pagos
      if (dto.estado === 'confirmada') {
        throw new BadRequestException(
          'La reserva se confirmará automáticamente al registrar el anticipo mínimo del 50 %',
        );
      }

      // Conservar las fechas actuales si no se envían nuevas
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

      // Verificar que el huésped exista y esté activo
      const huespedId = dto.huespedId ?? reserva.huesped.id;

      const huesped = await huespedRepository.findOne({
        where: {
          id: huespedId,
          estado: true,
        },
      });

      if (!huesped) {
        throw new NotFoundException(
          'El huésped no existe o está inactivo',
        );
      }

      // Conservar las habitaciones actuales si no se envían nuevas
      const habitacionesIds = (
        dto.habitacionesIds ??
        reserva.detalles.map(
          (detalle) => detalle.habitacion.id,
        )
      ).sort((a, b) => a - b);

      if (habitacionesIds.length === 0) {
        throw new BadRequestException(
          'La reserva debe tener al menos una habitación',
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
          'Una o más habitaciones no existen',
        );
      }

      // Verificar estado y tipo de habitación
      for (const habitacion of habitaciones) {
        if (habitacion.estado !== 'disponible') {
          throw new ConflictException(
            `La habitación ${habitacion.numero} no está disponible`,
          );
        }

        if (!habitacion.tipoHabitacion.activo) {
          throw new BadRequestException(
            `El tipo de habitación ${habitacion.numero} está inactivo`,
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
          'Una o más habitaciones ya tienen una reserva para esas fechas',
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
}
