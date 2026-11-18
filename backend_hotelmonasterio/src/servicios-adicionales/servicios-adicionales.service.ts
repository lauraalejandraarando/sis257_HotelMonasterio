import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ServicioAdicional } from '../entities/servicio-adicional.entity';
import { Reserva } from '../entities/reserva.entity';
import { TarifaServicio } from '../entities/tarifa-servicio.entity';
import { CrearServicioAdicionalDto } from './crear-servicio-adicional.dto';
import { ActualizarServicioAdicionalDto } from './actualizar-servicio-adicional.dto';

@Injectable()
export class ServiciosAdicionalesService {
  constructor(
    @InjectRepository(ServicioAdicional)
    private readonly servicioRepository: Repository<ServicioAdicional>,

    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>,

    @InjectRepository(TarifaServicio)
    private readonly tarifaRepository: Repository<TarifaServicio>,
  ) {}

  async obtenerTodos() {
    return this.servicioRepository.find({
      relations: { reserva: true, tarifaServicio: true },
      order: { id: 'DESC' },
    });
  }

  async obtenerPorId(id: number) {
    const servicio = await this.servicioRepository.findOne({
      where: { id },
      relations: { reserva: true, tarifaServicio: true },
    });

    if (!servicio) {
      throw new NotFoundException('Servicio adicional no encontrado');
    }

    return servicio;
  }

  async obtenerPorReserva(reservaId: number) {
    return this.servicioRepository.find({
      where: { reserva: { id: reservaId } },
      relations: { reserva: true, tarifaServicio: true },
      order: { id: 'DESC' },
    });
  }

  // Modificado por Brayan: registrar servicio adicional
  async crear(dto: CrearServicioAdicionalDto) {
    const reserva = await this.reservaRepository.findOne({
      where: { id: dto.reservaId },
    });

    if (!reserva) {
      throw new NotFoundException('Reserva no encontrada');
    }

    if (['cancelada', 'finalizada'].includes(reserva.estado)) {
      throw new BadRequestException(
        'No se pueden agregar servicios a una reserva cancelada o finalizada',
      );
    }

    const tarifa = await this.tarifaRepository.findOne({
      where: { id: dto.tarifaServicioId },
    });

    if (!tarifa) {
      throw new NotFoundException('Tarifa de servicio no encontrada');
    }

    if (!tarifa.activo) {
      throw new BadRequestException('La tarifa de servicio está inactiva');
    }

    const precio = Number(tarifa.precio);
    const importe = precio * dto.cantidad;

    const servicio = this.servicioRepository.create({
      cantidad: dto.cantidad,
      precioUnitario: precio.toFixed(2),
      importeTotal: importe.toFixed(2),
      observaciones: dto.observaciones ?? null,
      reserva,
      tarifaServicio: tarifa,
    });

    return this.servicioRepository.save(servicio);
  }

  // Modificado por Brayan: actualizar servicio adicional
  async actualizar(id: number, dto: ActualizarServicioAdicionalDto) {
    const servicio = await this.obtenerPorId(id);

    if (dto.reservaId !== undefined) {
      const reserva = await this.reservaRepository.findOne({
        where: { id: dto.reservaId },
      });

      if (!reserva) {
        throw new NotFoundException('Reserva no encontrada');
      }

      if (['cancelada', 'finalizada'].includes(reserva.estado)) {
        throw new BadRequestException(
          'No se pueden agregar servicios a una reserva cancelada o finalizada',
        );
      }

      servicio.reserva = reserva;
    }

    if (dto.tarifaServicioId !== undefined) {
      const tarifa = await this.tarifaRepository.findOne({
        where: { id: dto.tarifaServicioId },
      });

      if (!tarifa) {
        throw new NotFoundException('Tarifa de servicio no encontrada');
      }

      if (!tarifa.activo) {
        throw new BadRequestException('La tarifa de servicio está inactiva');
      }

      servicio.tarifaServicio = tarifa;
    }

    if (dto.cantidad !== undefined) {
      servicio.cantidad = dto.cantidad;
    }

    if (dto.observaciones !== undefined) {
      servicio.observaciones = dto.observaciones;
    }

    const precio = Number(servicio.tarifaServicio.precio);

    servicio.precioUnitario = precio.toFixed(2);
    servicio.importeTotal = (precio * servicio.cantidad).toFixed(2);

    return this.servicioRepository.save(servicio);
  }

  // Modificado por Brayan: eliminar servicio adicional
  async eliminar(id: number) {
    const servicio = await this.obtenerPorId(id);
    await this.servicioRepository.remove(servicio);

    return { mensaje: 'Servicio adicional eliminado correctamente' };
  }
}