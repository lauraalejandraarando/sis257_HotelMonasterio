
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Pago } from '../entities/pago.entity';
import { Reserva } from '../entities/reserva.entity';
import { DetalleReserva } from '../entities/detalle-reserva.entity';

import { PagosService } from './pagos.service';
import { PagosController } from './pagos.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Pago,
      Reserva,
      DetalleReserva,
    ]),
  ],
  providers: [PagosService],
  controllers: [PagosController],
  exports: [PagosService],
})
export class PagosModule {}
