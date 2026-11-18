
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Habitacion } from '../entities/habitacion.entity';
import { TipoHabitacion } from '../entities/tipo-habitacion.entity';

// Modificado por Brayan
@Injectable()
export class HabitacionesService {
  constructor(
    @InjectRepository(Habitacion)
    private habitacionRepository: Repository<Habitacion>,

    @InjectRepository(TipoHabitacion)
    private tipoRepository: Repository<TipoHabitacion>,
  ) {}

  async findAll() {
   return this.habitacionRepository.find({
  relations: {
    tipoHabitacion: true,
  },
  order: { id: 'ASC' },
});
  }

  async findOne(id: number) {
   const habitacion = await this.habitacionRepository.findOne({
  where: { id },
  relations: {
    tipoHabitacion: true,
  },
});

    if (!habitacion) {
      throw new NotFoundException('Habitacion no encontrada');
    }

    return habitacion;
  }

  async create(data: any) {
    const tipo = await this.tipoRepository.findOneBy({
      id: Number(data.tipoHabitacionId),
    });

    if (!tipo) {
      throw new NotFoundException('Tipo de habitacion no encontrado');
    }

    const habitacion = this.habitacionRepository.create({
      numero: data.numero,
      piso: data.piso,
      estado: data.estado,
      observaciones: data.observaciones,
      tipoHabitacion: tipo,
    });

    return this.habitacionRepository.save(habitacion);
  }

  async update(id: number, data: any) {
    const habitacion = await this.findOne(id);

    if (data.tipoHabitacionId !== undefined) {
      const tipo = await this.tipoRepository.findOneBy({
        id: Number(data.tipoHabitacionId),
      });

      if (!tipo) {
        throw new NotFoundException('Tipo de habitacion no encontrado');
      }

      habitacion.tipoHabitacion = tipo;
    }

    if (data.numero !== undefined) habitacion.numero = data.numero;
    if (data.piso !== undefined) habitacion.piso = data.piso;
    if (data.estado !== undefined) habitacion.estado = data.estado;
    if (data.observaciones !== undefined) {
      habitacion.observaciones = data.observaciones;
    }

    return this.habitacionRepository.save(habitacion);
  }

  async remove(id: number) {
    const habitacion = await this.findOne(id);
    await this.habitacionRepository.remove(habitacion);

    return { mensaje: 'Habitacion eliminada correctamente' };
  }
}
