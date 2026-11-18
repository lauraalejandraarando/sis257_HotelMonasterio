
import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CrearReservaDto } from './crear-reserva.dto';

import {
  IsOptional,
  IsIn,
} from 'class-validator';

export class ActualizarReservaDto extends PartialType(CrearReservaDto) {

  @ApiPropertyOptional({
    description: 'Estado actual de la reserva',
    example: 'pendiente',
    enum: ['pendiente', 'confirmada', 'cancelada'],
  })
  @IsOptional()
  @IsIn(['pendiente', 'confirmada', 'cancelada'])
  estado?: 'pendiente' | 'confirmada' | 'cancelada';
}
