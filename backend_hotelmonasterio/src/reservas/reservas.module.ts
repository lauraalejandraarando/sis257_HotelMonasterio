import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Reserva } from '../entities/reserva.entity';
import { DetalleReserva } from '../entities/detalle-reserva.entity';
import { Huesped } from '../entities/huesped.entity';
import { Habitacion } from '../entities/habitacion.entity';

import { PagosModule } from '../pagos/pagos.module';

import { ReservasController } from './reservas.controller';
import { ReservasService } from './reservas.service';
import { ReservasScheduler } from './reservas.scheduler';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Reserva,
      DetalleReserva,
      Huesped,
      Habitacion,
    ]),
    PagosModule,
  ],
  controllers: [ReservasController],
  providers: [
    ReservasService,
    ReservasScheduler,
  ],
  exports: [ReservasService],
})
export class ReservasModule {}