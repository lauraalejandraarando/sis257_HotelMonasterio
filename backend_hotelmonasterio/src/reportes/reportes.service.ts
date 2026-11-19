
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reserva } from '../entities/reserva.entity';
import { Habitacion } from '../entities/habitacion.entity';
import { Huesped } from '../entities/huesped.entity';
import { Pago } from '../entities/pago.entity';

// Modificado por Brayan
@Injectable()
export class ReportesService {
  constructor(
    @InjectRepository(Reserva)
    private readonly reservas: Repository<Reserva>,

    @InjectRepository(Habitacion)
    private readonly habitaciones: Repository<Habitacion>,

    @InjectRepository(Huesped)
    private readonly huespedes: Repository<Huesped>,

    @InjectRepository(Pago)
    private readonly pagos: Repository<Pago>,
  ) {}

  async obtenerResumen() {
    const [reservas, habitaciones, huespedes, pagos] =
      await Promise.all([
        this.reservas.find(),
        this.habitaciones.find(),
        this.huespedes.find(),
        this.pagos.find(),
      ]);

    return {
      totalReservas: reservas.length,
      reservasPendientes: reservas.filter(
        r => r.estado === 'pendiente',
      ).length,
      reservasConfirmadas: reservas.filter(
        r => r.estado === 'confirmada',
      ).length,
      totalHabitaciones: habitaciones.length,
      habitacionesDisponibles: habitaciones.filter(
        h => h.estado === 'disponible',
      ).length,
      habitacionesOcupadas: habitaciones.filter(
        h => h.estado === 'ocupada',
      ).length,
      totalHuespedes: huespedes.length,
      totalPagos: pagos.length,
      ingresosTotales: pagos.reduce(
        (total, pago) => total + Number(pago.monto),
        0,
      ),
    };
  }

  async obtenerReservas() {
    return this.reservas.find({
      relations: { huesped: true },
      order: { id: 'DESC' },
    });
  }

  async obtenerIngresos(desde?: string, hasta?: string) {
    let pagos = await this.pagos.find({
      relations: { reserva: true },
      order: { fechaPago: 'DESC' },
    });

    if (desde) {
      pagos = pagos.filter(
        pago =>
          new Date(pago.fechaPago).toISOString().slice(0, 10) >= desde,
      );
    }

    if (hasta) {
      pagos = pagos.filter(
        pago =>
          new Date(pago.fechaPago).toISOString().slice(0, 10) <= hasta,
      );
    }

    const totalIngresos = pagos.reduce(
      (total, pago) => total + Number(pago.monto),
      0,
    );

    const porMetodo = pagos.reduce((resultado, pago) => {
      const metodo = pago.metodoPago;
      resultado[metodo] =
        (resultado[metodo] || 0) + Number(pago.monto);
      return resultado;
    }, {} as Record<string, number>);

    const porTipo = pagos.reduce((resultado, pago) => {
      const tipo = pago.tipoPago;
      resultado[tipo] =
        (resultado[tipo] || 0) + Number(pago.monto);
      return resultado;
    }, {} as Record<string, number>);

    return {
      cantidadPagos: pagos.length,
      totalIngresos: Number(totalIngresos.toFixed(2)),
      ingresosPorMetodo: porMetodo,
      ingresosPorTipo: porTipo,
      pagos,
    };
  }

  async obtenerOcupacion() {
    const habitaciones = await this.habitaciones.find();

    const total = habitaciones.length;
    const ocupadas = habitaciones.filter(
      h => h.estado === 'ocupada',
    ).length;
    const disponibles = habitaciones.filter(
      h => h.estado === 'disponible',
    ).length;

    const porcentajeOcupacion =
      total > 0 ? Number(((ocupadas / total) * 100).toFixed(2)) : 0;

    return {
      totalHabitaciones: total,
      habitacionesOcupadas: ocupadas,
      habitacionesDisponibles: disponibles,
      otrasHabitaciones: total - ocupadas - disponibles,
      porcentajeOcupacion,
    };
  }

  async obtenerReservasPorEstado() {
    const reservas = await this.reservas.find();

    const resultado = reservas.reduce((estados, reserva) => {
      const estado = reserva.estado || 'sin estado';
      estados[estado] = (estados[estado] || 0) + 1;
      return estados;
    }, {} as Record<string, number>);

    return {
      totalReservas: reservas.length,
      reservasPorEstado: resultado,
    };
  }
}
