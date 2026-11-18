import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Huesped } from '../entities/huesped.entity';
import { HuespedesController } from './huespedes.controller';
import { HuespedesService } from './huespedes.service';

// Modificado por Brayan
@Module({
  imports: [TypeOrmModule.forFeature([Huesped])],
  controllers: [HuespedesController],
  providers: [HuespedesService],
})
export class HuespedesModule {}