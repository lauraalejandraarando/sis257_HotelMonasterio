
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Reserva } from '../entities/reserva.entity';
import { DetalleReserva } from '../entities/detalle-reserva.entity';
import { Huesped } from '../entities/huesped.entity';
import { Habitacion } from '../entities/habitacion.entity';

import { ReservasController } from './reservas.controller';
import { ReservasService } from './reservas.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Reserva,
      DetalleReserva,
      Huesped,
      Habitacion,
    ]),
  ],
  controllers: [ReservasController],
  providers: [ReservasService],
  exports: [ReservasService],
})
export class ReservasModule {}
