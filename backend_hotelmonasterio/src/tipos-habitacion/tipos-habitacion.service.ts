
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoHabitacion } from '../entities/tipo-habitacion.entity';

@Injectable()
export class TiposHabitacionService {
  constructor(
    @InjectRepository(TipoHabitacion)
    private readonly tiposHabitacionRepository: Repository<TipoHabitacion>,
  ) {}

  async crear(datos: Partial<TipoHabitacion>): Promise<TipoHabitacion> {
    const existente = await this.tiposHabitacionRepository.findOne({
      where: { nombre: datos.nombre },
    });

    if (existente) {
      throw new ConflictException(
        'Ya existe un tipo de habitación con ese nombre',
      );
    }

    const tipoHabitacion = this.tiposHabitacionRepository.create(datos);

    return this.tiposHabitacionRepository.save(tipoHabitacion);
  }

  async obtenerTodos(): Promise<TipoHabitacion[]> {
    return this.tiposHabitacionRepository.find({
      order: { id: 'ASC' },
    });
  }

  async obtenerPorId(id: number): Promise<TipoHabitacion> {
    const tipoHabitacion = await this.tiposHabitacionRepository.findOne({
      where: { id },
    });

    if (!tipoHabitacion) {
      throw new NotFoundException('Tipo de habitación no encontrado');
    }

    return tipoHabitacion;
  }

  async actualizar(
    id: number,
    datos: Partial<TipoHabitacion>,
  ): Promise<TipoHabitacion> {
    const tipoHabitacion = await this.obtenerPorId(id);

    if (datos.nombre && datos.nombre !== tipoHabitacion.nombre) {
      const existente = await this.tiposHabitacionRepository.findOne({
        where: { nombre: datos.nombre },
      });

      if (existente) {
        throw new ConflictException(
          'Ya existe otro tipo de habitación con ese nombre',
        );
      }
    }

    Object.assign(tipoHabitacion, datos);

    return this.tiposHabitacionRepository.save(tipoHabitacion);
  }

  async desactivar(id: number): Promise<TipoHabitacion> {
    const tipoHabitacion = await this.obtenerPorId(id);

    tipoHabitacion.activo = false;

    return this.tiposHabitacionRepository.save(tipoHabitacion);
  }
}
