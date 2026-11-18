
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TipoHabitacion } from '../entities/tipo-habitacion.entity';
import { TiposHabitacionController } from './tipos-habitacion.controller';
import { TiposHabitacionService } from './tipos-habitacion.service';

@Module({
  imports: [TypeOrmModule.forFeature([TipoHabitacion])],
  controllers: [TiposHabitacionController],
  providers: [TiposHabitacionService],
  exports: [TiposHabitacionService],
})
export class TiposHabitacionModule {}
