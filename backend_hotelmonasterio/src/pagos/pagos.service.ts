
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { DataSource } from 'typeorm';

import { Pago } from '../entities/pago.entity';
import { Reserva } from '../entities/reserva.entity';
import { DetalleReserva } from '../entities/detalle-reserva.entity';

import { CrearPagoDto } from './dto/crear-pago.dto';

@Injectable()
export class PagosService {
  constructor(
    private readonly dataSource: DataSource,
  ) {}

  // Calcular el total de una reserva en centavos
  private calcularTotalCentavos(
    reserva: Reserva,
  ): number {
    const entrada = new Date(
      `${reserva.fechaEntrada}T00:00:00Z`,
    );

    const salida = new Date(
      `${reserva.fechaSalida}T00:00:00Z`,
    );

    const milisegundosPorDia = 24 * 60 * 60 * 1000;

    const noches = Math.round(
      (salida.getTime() - entrada.getTime()) /
        milisegundosPorDia,
    );

    if (noches <= 0) {
      throw new BadRequestException(
        'La reserva tiene fechas inválidas',
      );
    }

    return reserva.detalles.reduce(
      (total, detalle) => {
        const precioCentavos = Math.round(
          Number(detalle.precioNoche) * 100,
        );

        return total + precioCentavos * noches;
      },
      0,
    );
  }

  // Sumar únicamente los pagos que representan dinero recibido
  private calcularDineroRecibidoCentavos(
    pagos: Pago[],
  ): number {
    return pagos
      .filter(
        (pago) =>
          pago.tipoPago === 'adelanto' ||
          pago.tipoPago === 'saldo',
      )
      .reduce(
        (total, pago) =>
          total + Math.round(Number(pago.monto) * 100),
        0,
      );
  }

  // Sumar los reembolsos registrados
  private calcularReembolsosCentavos(
    pagos: Pago[],
  ): number {
    return pagos
      .filter(
        (pago) => pago.tipoPago === 'reembolso',
      )
      .reduce(
        (total, pago) =>
          total + Math.round(Number(pago.monto) * 100),
        0,
      );
  }

  // Consultar el estado de cuenta de una reserva
  async obtenerEstadoCuenta(reservaId: number) {
    const reserva = await this.dataSource
      .getRepository(Reserva)
      .findOne({
        where: { id: reservaId },
        relations: {
          detalles: true,
        },
      });

    if (!reserva) {
      throw new NotFoundException(
        'Reserva no encontrada',
      );
    }

    const totalCentavos =
      this.calcularTotalCentavos(reserva);

    const pagos = await this.dataSource
      .getRepository(Pago)
      .find({
        where: {
          reserva: { id: reservaId },
        },
      });

    const recibidoCentavos =
      this.calcularDineroRecibidoCentavos(pagos);

    const reembolsadoCentavos =
      this.calcularReembolsosCentavos(pagos);

    const penalizacionCentavos = pagos
      .filter(
        (pago) => pago.tipoPago === 'penalizacion',
      )
      .reduce(
        (total, pago) =>
          total + Math.round(Number(pago.monto) * 100),
        0,
      );

    const minimoCentavos = Math.ceil(
      totalCentavos * 0.5,
    );

    const dineroRetenidoCentavos =
      recibidoCentavos - reembolsadoCentavos;

    const saldoCentavos =
      reserva.estado === 'cancelada'
        ? 0
        : Math.max(
            0,
            totalCentavos - dineroRetenidoCentavos,
          );

    const porcentaje =
      totalCentavos > 0
        ? Number(
            (
              (recibidoCentavos / totalCentavos) *
              100
            ).toFixed(2),
          )
        : 0;

    return {
      reservaId: reserva.id,
      codigoReserva: reserva.codigoReserva,
      totalReserva: totalCentavos / 100,
      totalPagado: recibidoCentavos / 100,
      totalReembolsado:
        reembolsadoCentavos / 100,
      penalizacion:
        penalizacionCentavos / 100,
      dineroRetenido:
        dineroRetenidoCentavos / 100,
      minimoParaConfirmar:
        minimoCentavos / 100,
      saldoPendiente: saldoCentavos / 100,
      porcentajePagado: porcentaje,
      pagoMinimoAlcanzado:
        recibidoCentavos >= minimoCentavos,
      estadoReserva: reserva.estado,
      fechaLimitePago: reserva.fechaLimitePago,
    };
  }

  // Consultar el historial de movimientos de una reserva
  async obtenerPagosPorReserva(reservaId: number) {
    const reserva = await this.dataSource
      .getRepository(Reserva)
      .findOne({
        where: { id: reservaId },
      });

    if (!reserva) {
      throw new NotFoundException(
        'Reserva no encontrada',
      );
    }

    return this.dataSource
      .getRepository(Pago)
      .find({
        where: {
          reserva: { id: reservaId },
        },
        order: {
          fechaPago: 'ASC',
        },
      });
  }

  // Registrar un pago y confirmar la reserva al alcanzar el 50 %
  async registrarPago(dto: CrearPagoDto) {
    const resultado = await this.dataSource.transaction(
      async (manager) => {
        const reservasRepository =
          manager.getRepository(Reserva);

        const pagosRepository =
          manager.getRepository(Pago);

        const detallesRepository =
          manager.getRepository(DetalleReserva);

        // Bloquear únicamente la reserva
        const reserva = await reservasRepository
          .createQueryBuilder('reserva')
          .where('reserva.id = :id', {
            id: dto.reservaId,
          })
          .setLock('pessimistic_write')
          .getOne();

        if (!reserva) {
          throw new NotFoundException(
            'Reserva no encontrada',
          );
        }

        if (reserva.estado === 'cancelada') {
          throw new BadRequestException(
            'No se pueden registrar pagos de una reserva cancelada',
          );
        }

        if (
          reserva.estado !== 'pendiente' &&
          reserva.estado !== 'confirmada'
        ) {
          throw new BadRequestException(
            'La reserva tiene un estado que no permite registrar pagos',
          );
        }

        // Verificar el plazo de pago
        if (
          reserva.estado === 'pendiente' &&
          reserva.fechaLimitePago &&
          new Date() > new Date(reserva.fechaLimitePago)
        ) {
          reserva.estado = 'cancelada';

          reserva.observaciones =
            `${reserva.observaciones ?? ''} Reserva cancelada por vencimiento del plazo de pago.`
              .trim();

          await reservasRepository.save(reserva);

          return {
            vencida: true,
          };
        }

        const detalles = await detallesRepository.find({
          where: {
            reserva: { id: reserva.id },
          },
        });

        reserva.detalles = detalles;

        if (detalles.length === 0) {
          throw new BadRequestException(
            'La reserva no tiene habitaciones registradas',
          );
        }

        const totalCentavos =
          this.calcularTotalCentavos(reserva);

        const montoCentavos = Math.round(
          Number(dto.monto) * 100,
        );

        if (
          !Number.isFinite(Number(dto.monto)) ||
          montoCentavos <= 0
        ) {
          throw new BadRequestException(
            'El monto del pago debe ser mayor que cero',
          );
        }

        const pagosAnteriores =
          await pagosRepository.find({
            where: {
              reserva: { id: reserva.id },
            },
          });

        const recibidoCentavos =
          this.calcularDineroRecibidoCentavos(
            pagosAnteriores,
          );

        const reembolsadoCentavos =
          this.calcularReembolsosCentavos(
            pagosAnteriores,
          );

        const pagadoNetoCentavos =
          recibidoCentavos - reembolsadoCentavos;

        const saldoCentavos =
          totalCentavos - pagadoNetoCentavos;

        if (montoCentavos > saldoCentavos) {
          throw new BadRequestException(
            `El pago supera el saldo pendiente de Bs ${(saldoCentavos / 100).toFixed(2)}`,
          );
        }

        const nuevoPago = pagosRepository.create({
          monto: (montoCentavos / 100).toFixed(2),
          metodoPago: dto.metodoPago,
          tipoPago: dto.tipoPago ?? 'adelanto',
          referencia: dto.referencia ?? null,
          observaciones: dto.observaciones ?? null,
          reserva,
        });

        const pagoGuardado =
          await pagosRepository.save(nuevoPago);

        const nuevoTotalPagado =
          pagadoNetoCentavos + montoCentavos;

        const minimoCentavos = Math.ceil(
          totalCentavos * 0.5,
        );

        if (
          reserva.estado === 'pendiente' &&
          nuevoTotalPagado >= minimoCentavos
        ) {
          reserva.estado = 'confirmada';

          await reservasRepository.save(reserva);
        }

        return {
          vencida: false,
          pago: pagoGuardado,
          reservaId: reserva.id,
          totalReserva: totalCentavos / 100,
          totalPagado: nuevoTotalPagado / 100,
          minimoParaConfirmar:
            minimoCentavos / 100,
          saldoPendiente:
            (totalCentavos - nuevoTotalPagado) / 100,
          estadoReserva: reserva.estado,
        };
      },
    );

    if (resultado.vencida) {
      throw new BadRequestException(
        'El plazo de 2 horas ha vencido. La reserva fue cancelada y la habitación quedó liberada para otras reservas.',
      );
    }

    return resultado;
  }

  // Cancelar una reserva y aplicar la penalización correspondiente
  async cancelarReserva(
    reservaId: number,
    observaciones?: string,
  ) {
    return this.dataSource.transaction(
      async (manager) => {
        const reservasRepository =
          manager.getRepository(Reserva);

        const pagosRepository =
          manager.getRepository(Pago);

        // Bloquear la reserva para evitar cancelaciones simultáneas
        const reserva = await reservasRepository
          .createQueryBuilder('reserva')
          .where('reserva.id = :id', {
            id: reservaId,
          })
          .setLock('pessimistic_write')
          .getOne();

        if (!reserva) {
          throw new NotFoundException(
            'Reserva no encontrada',
          );
        }

        if (reserva.estado === 'cancelada') {
          throw new BadRequestException(
            'La reserva ya se encuentra cancelada',
          );
        }

        if (
          reserva.estado !== 'pendiente' &&
          reserva.estado !== 'confirmada'
        ) {
          throw new BadRequestException(
            'No se puede cancelar una reserva con este estado',
          );
        }

        const estadoAnterior = reserva.estado;

        // Consultar todos los movimientos financieros
        const pagos = await pagosRepository.find({
          where: {
            reserva: { id: reserva.id },
          },
        });

        const recibidoCentavos =
          this.calcularDineroRecibidoCentavos(pagos);

        const reembolsadoCentavos =
          this.calcularReembolsosCentavos(pagos);

        const pagadoNetoCentavos =
          recibidoCentavos - reembolsadoCentavos;

        let penalizacionCentavos = 0;
        let reembolsoCentavos = 0;

        // Las reservas confirmadas tienen penalización del 50 %
        if (estadoAnterior === 'confirmada') {
          penalizacionCentavos = Math.round(
            pagadoNetoCentavos * 0.5,
          );

          reembolsoCentavos =
            pagadoNetoCentavos -
            penalizacionCentavos;

          // Registrar la penalización
          if (penalizacionCentavos > 0) {
            const penalizacion =
              pagosRepository.create({
                monto: (
                  penalizacionCentavos / 100
                ).toFixed(2),
                metodoPago: 'interno',
                tipoPago: 'penalizacion',
                referencia: `CANCEL-${reserva.id}`,
                observaciones:
                  'Penalización del 50 % del dinero pagado por cancelación de reserva confirmada.',
                reserva,
              });

            await pagosRepository.save(penalizacion);
          }

          // Registrar el dinero que corresponde devolver
          if (reembolsoCentavos > 0) {
            const reembolso =
              pagosRepository.create({
                monto: (
                  reembolsoCentavos / 100
                ).toFixed(2),
                metodoPago: 'interno',
                tipoPago: 'reembolso',
                referencia: `CANCEL-${reserva.id}`,
                observaciones:
                  'Reembolso del 50 % restante del dinero pagado por cancelación de reserva confirmada. Registrar la devolución efectiva al huésped.',
                reserva,
              });

            await pagosRepository.save(reembolso);
          }
        }

        // Actualizar el estado de la reserva
        reserva.estado = 'cancelada';

        if (observaciones) {
          reserva.observaciones =
            `${reserva.observaciones ?? ''} ${observaciones}`
              .trim();
        }

        reserva.observaciones =
          `${reserva.observaciones ?? ''} Cancelación registrada.`
            .trim();

        await reservasRepository.save(reserva);

        return {
          mensaje:
            'La reserva fue cancelada correctamente.',
          reservaId: reserva.id,
          codigoReserva: reserva.codigoReserva,
          estadoAnterior,
          estadoActual: reserva.estado,
          dineroPagado:
            pagadoNetoCentavos / 100,
          penalizacion:
            penalizacionCentavos / 100,
          reembolso:
            reembolsoCentavos / 100,
          aplicaPenalizacion:
            estadoAnterior === 'confirmada',
        };
      },
    );
  }

  // Cancelar automáticamente las reservas pendientes cuyo plazo de pago venció
  async cancelarReservasVencidas(): Promise<number> {
    const reservasVencidas = await this.dataSource
      .getRepository(Reserva)
      .createQueryBuilder('reserva')
      .select('reserva.id', 'id')
      .where('reserva.estado = :estado', {
        estado: 'pendiente',
      })
      .andWhere('reserva.fechaLimitePago IS NOT NULL')
      .andWhere('reserva.fechaLimitePago <= CURRENT_TIMESTAMP')
      .getRawMany();

    let cantidadCanceladas = 0;

    for (const item of reservasVencidas) {
      const resultado = await this.dataSource.transaction(
        async (manager) => {
          const reservasRepository =
            manager.getRepository(Reserva);

          const pagosRepository =
            manager.getRepository(Pago);

          const detallesRepository =
            manager.getRepository(DetalleReserva);

          // Bloquear la reserva para evitar conflictos con pagos simultáneos
          const reserva = await reservasRepository
            .createQueryBuilder('reserva')
            .where('reserva.id = :id', {
              id: Number(item.id),
            })
            .setLock('pessimistic_write')
            .getOne();

          if (
            !reserva ||
            reserva.estado !== 'pendiente' ||
            !reserva.fechaLimitePago ||
            new Date(reserva.fechaLimitePago) > new Date()
          ) {
            return false;
          }

          const detalles = await detallesRepository.find({
            where: {
              reserva: { id: reserva.id },
            },
          });

          if (detalles.length === 0) {
            return false;
          }

          reserva.detalles = detalles;

          const totalCentavos =
            this.calcularTotalCentavos(reserva);

          const pagos = await pagosRepository.find({
            where: {
              reserva: { id: reserva.id },
            },
          });

          const recibidoCentavos =
            this.calcularDineroRecibidoCentavos(pagos);

          const reembolsadoCentavos =
            this.calcularReembolsosCentavos(pagos);

          const pagadoNetoCentavos = Math.max(
            0,
            recibidoCentavos - reembolsadoCentavos,
          );

          const minimoCentavos = Math.ceil(
            totalCentavos * 0.5,
          );

          // Si alcanzó el 50 %, confirmar en lugar de cancelar
          if (pagadoNetoCentavos >= minimoCentavos) {
            reserva.estado = 'confirmada';
            await reservasRepository.save(reserva);
            return false;
          }

          // Si hubo un pago parcial, registrar su devolución completa
          if (pagadoNetoCentavos > 0) {
            const reembolso = pagosRepository.create({
              monto: (pagadoNetoCentavos / 100).toFixed(2),
              metodoPago: 'interno',
              tipoPago: 'reembolso',
              referencia: `VENCIMIENTO-${reserva.id}`,
              observaciones:
                'Devolución completa del pago parcial por vencimiento del plazo de 2 horas. Sin penalización.',
              reserva,
            });

            await pagosRepository.save(reembolso);
          }

          // Cancelar sin penalización
          reserva.estado = 'cancelada';

          reserva.observaciones =
            `${reserva.observaciones ?? ''} Reserva cancelada automáticamente por vencimiento del plazo de 2 horas. Sin penalización.`
              .trim();

          await reservasRepository.save(reserva);

          return true;
        },
      );

      if (resultado) {
        cantidadCanceladas++;
      }
    }

    return cantidadCanceladas;
  }
}
