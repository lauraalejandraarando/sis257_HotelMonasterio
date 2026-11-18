import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ServicioAdicional } from '../entities/servicio-adicional.entity';
import { Reserva } from '../entities/reserva.entity';
import { TarifaServicio } from '../entities/tarifa-servicio.entity';

import { ServiciosAdicionalesController } from './servicios-adicionales.controller';
import { ServiciosAdicionalesService } from './servicios-adicionales.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ServicioAdicional,
      Reserva,
      TarifaServicio,
    ]),
  ],
  controllers: [ServiciosAdicionalesController],
  providers: [ServiciosAdicionalesService],
  exports: [ServiciosAdicionalesService],
})
export class ServiciosAdicionalesModule {}