
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TipoIncidente } from '../entities/tipo-incidente.entity';
import { CrearTipoIncidenteDto } from './dto/crear-tipo-incidente.dto';
import { ActualizarTipoIncidenteDto } from './dto/actualizar-tipo-incidente.dto';

@Injectable()
export class TiposIncidenteService {
  constructor(
    @InjectRepository(TipoIncidente)
    private readonly tiposIncidenteRepository: Repository<TipoIncidente>,
  ) {}

  async crear(
    datos: CrearTipoIncidenteDto,
  ): Promise<TipoIncidente> {
    const nombre = datos.nombre.trim();

    const existente = await this.tiposIncidenteRepository.findOne({
      where: { nombre },
    });

    if (existente) {
      throw new ConflictException(
        'Ya existe un tipo de incidente con ese nombre',
      );
    }

    const tipoIncidente = this.tiposIncidenteRepository.create({
      ...datos,
      nombre,
    });

    return this.tiposIncidenteRepository.save(tipoIncidente);
  }

  async obtenerTodos(): Promise<TipoIncidente[]> {
    return this.tiposIncidenteRepository.find({
      order: { id: 'ASC' },
    });
  }

  async obtenerPorId(id: number): Promise<TipoIncidente> {
    const tipoIncidente = await this.tiposIncidenteRepository.findOne({
      where: { id },
    });

    if (!tipoIncidente) {
      throw new NotFoundException(
        'Tipo de incidente no encontrado',
      );
    }

    return tipoIncidente;
  }

  async actualizar(
    id: number,
    datos: ActualizarTipoIncidenteDto,
  ): Promise<TipoIncidente> {
    const tipoIncidente = await this.obtenerPorId(id);

    if (datos.nombre) {
      const nombre = datos.nombre.trim();

      const existente = await this.tiposIncidenteRepository.findOne({
        where: { nombre },
      });

      if (existente && existente.id !== id) {
        throw new ConflictException(
          'Ya existe otro tipo de incidente con ese nombre',
        );
      }

      datos = { ...datos, nombre };
    }

    Object.assign(tipoIncidente, datos);

    return this.tiposIncidenteRepository.save(tipoIncidente);
  }

  async desactivar(id: number): Promise<TipoIncidente> {
    const tipoIncidente = await this.obtenerPorId(id);

    tipoIncidente.activo = false;

    return this.tiposIncidenteRepository.save(tipoIncidente);
  }
}
