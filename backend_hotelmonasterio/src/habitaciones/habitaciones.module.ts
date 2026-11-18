
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Habitacion } from '../entities/habitacion.entity';
import { TipoHabitacion } from '../entities/tipo-habitacion.entity';
import { HabitacionesController } from './habitaciones.controller';
import { HabitacionesService } from './habitaciones.service';

// Modificado por Brayan
@Module({
  imports: [
    TypeOrmModule.forFeature([Habitacion, TipoHabitacion]),
  ],
  controllers: [HabitacionesController],
  providers: [HabitacionesService],
})
export class HabitacionesModule {}
