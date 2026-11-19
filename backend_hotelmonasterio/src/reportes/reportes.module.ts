
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportesController } from './reportes.controller';
import { ReportesService } from './reportes.service';
import { Reserva } from '../entities/reserva.entity';
import { Habitacion } from '../entities/habitacion.entity';
import { Huesped } from '../entities/huesped.entity';
import { Pago } from '../entities/pago.entity';

// Modificado por Brayan
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Reserva,
      Habitacion,
      Huesped,
      Pago,
    ]),
  ],
  controllers: [ReportesController],
  providers: [ReportesService],
})
export class ReportesModule {}
