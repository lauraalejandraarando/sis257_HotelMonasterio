
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import { TurnoCaja } from '../entities/turno-caja.entity';
import { MovimientoCaja } from '../entities/movimiento-caja.entity';
import { AbrirTurnoDto } from './abrir-turno.dto';
import { CerrarTurnoDto } from './cerrar-turno.dto';
import { CrearMovimientoDto } from './crear-movimiento.dto';

@Injectable()
export class CajaService {
  constructor(
    @InjectRepository(TurnoCaja)
    private readonly turnoRepository: Repository<TurnoCaja>,

    @InjectRepository(MovimientoCaja)
    private readonly movimientoRepository: Repository<MovimientoCaja>,

    private readonly dataSource: DataSource,
  ) {}

  async obtenerTurnos() {
    return this.turnoRepository.find({
      order: { id: 'DESC' },
    });
  }

  async obtenerTurnoPorId(id: number) {
    const turno = await this.turnoRepository.findOne({
      where: { id },
    });

    if (!turno) {
      throw new NotFoundException('Turno de caja no encontrado');
    }

    return turno;
  }

  // Modificado por Brayan: abrir turno de caja
  async abrirTurno(dto: AbrirTurnoDto) {
    const existente = await this.turnoRepository.findOne({
      where: { estado: 'abierto' },
    });

    if (existente) {
      throw new ConflictException('Ya existe un turno de caja abierto');
    }

    const fecha = new Date(dto.fechaOperativa + 'T00:00:00');

    if (
      isNaN(fecha.getTime()) ||
      fecha.toISOString().slice(0, 10) !== dto.fechaOperativa
    ) {
      throw new BadRequestException('La fecha operativa no es válida');
    }

    const turno = this.turnoRepository.create({
      tipoTurno: dto.tipoTurno,
      fechaOperativa: dto.fechaOperativa,
      fechaApertura: new Date(),
      montoInicial: Number(dto.montoInicial).toFixed(2),
      estado: 'abierto',
      observaciones: dto.observaciones ?? null,
    });

    return this.turnoRepository.save(turno);
  }

  // Modificado por Brayan: registrar movimiento de caja
  async crearMovimiento(dto: CrearMovimientoDto) {
    return this.dataSource.transaction(async (manager) => {
      const turnos = manager.getRepository(TurnoCaja);
      const movimientos = manager.getRepository(MovimientoCaja);

      const turno = await turnos.findOne({
        where: { id: dto.turnoCajaId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!turno) {
        throw new NotFoundException('Turno de caja no encontrado');
      }

      if (turno.estado !== 'abierto') {
        throw new BadRequestException(
          'No se pueden registrar movimientos en una caja cerrada',
        );
      }

      const movimiento = movimientos.create({
        tipoMovimiento: dto.tipoMovimiento,
        concepto: dto.concepto,
        monto: Number(dto.monto).toFixed(2),
        metodoPago: dto.metodoPago,
        referencia: dto.referencia ?? null,
        observaciones: dto.observaciones ?? null,
        turnoCaja: turno,
      });

      return movimientos.save(movimiento);
    });
  }

  async obtenerMovimientos(turnoId: number) {
    await this.obtenerTurnoPorId(turnoId);

    return this.movimientoRepository.find({
      where: { turnoCaja: { id: turnoId } },
      relations: { turnoCaja: true },
      order: { id: 'DESC' },
    });
  }

  // Modificado por Brayan: cerrar turno y calcular diferencia
  async cerrarTurno(id: number, dto: CerrarTurnoDto) {
    return this.dataSource.transaction(async (manager) => {
      const turnos = manager.getRepository(TurnoCaja);
      const movimientos = manager.getRepository(MovimientoCaja);

      const turno = await turnos.findOne({
        where: { id },
        lock: { mode: 'pessimistic_write' },
      });

      if (!turno) {
        throw new NotFoundException('Turno de caja no encontrado');
      }

      if (turno.estado !== 'abierto') {
        throw new BadRequestException('El turno ya está cerrado');
      }

      const lista = await movimientos.find({
        where: { turnoCaja: { id } },
      });

      let ingresosEfectivo = 0;
      let egresosEfectivo = 0;

      for (const movimiento of lista) {
        if (movimiento.metodoPago !== 'efectivo') continue;

        if (movimiento.tipoMovimiento === 'ingreso') {
          ingresosEfectivo += Number(movimiento.monto);
        } else {
          egresosEfectivo += Number(movimiento.monto);
        }
      }

      const esperado =
        Number(turno.montoInicial) + ingresosEfectivo - egresosEfectivo;

      const contado = Number(dto.dineroContado);

      turno.efectivoEsperado = esperado.toFixed(2);
      turno.dineroContado = contado.toFixed(2);
      turno.diferencia = (contado - esperado).toFixed(2);
      turno.fechaCierre = new Date();
      turno.estado = 'cerrado';

      if (dto.observaciones) {
        turno.observaciones = dto.observaciones;
      }

      return turnos.save(turno);
    });
  }
}
