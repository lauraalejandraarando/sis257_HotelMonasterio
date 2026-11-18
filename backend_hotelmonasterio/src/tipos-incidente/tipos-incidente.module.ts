
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TipoIncidente } from '../entities/tipo-incidente.entity';

import { TiposIncidenteController } from './tipos-incidente.controller';
import { TiposIncidenteService } from './tipos-incidente.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TipoIncidente]),
  ],
  controllers: [TiposIncidenteController],
  providers: [TiposIncidenteService],
  exports: [TiposIncidenteService],
})
export class TiposIncidenteModule {}
