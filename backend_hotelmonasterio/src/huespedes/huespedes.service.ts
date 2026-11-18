import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Huesped } from '../entities/huesped.entity';
import { CreateHuespedDto } from './dto/create-huesped.dto';
import { UpdateHuespedDto } from './dto/update-huesped.dto';

// Modificado por Brayan
@Injectable()
export class HuespedesService {
  constructor(
    @InjectRepository(Huesped)
    private readonly huespedRepository: Repository<Huesped>,
  ) {}

  findAll() {
    return this.huespedRepository.find({
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number) {
    const huesped = await this.huespedRepository.findOneBy({ id });

    if (!huesped) {
      throw new NotFoundException('Huesped no encontrado');
    }

    return huesped;
  }

  create(data: CreateHuespedDto) {
    const huesped = this.huespedRepository.create(data);
    return this.huespedRepository.save(huesped);
  }

  async update(id: number, data: UpdateHuespedDto) {
    const huesped = await this.findOne(id);
    Object.assign(huesped, data);
    return this.huespedRepository.save(huesped);
  }

  async remove(id: number) {
    const huesped = await this.findOne(id);
    await this.huespedRepository.remove(huesped);

    return { mensaje: 'Huesped eliminado correctamente' };
  }
}