
import {
  IsInt,
  IsPositive,
  IsDateString,
  IsArray,
  ArrayNotEmpty,
  ArrayUnique,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { Type } from 'class-transformer';

import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

export class CrearReservaDto {
  @ApiProperty({
    description: 'ID del huésped registrado en el sistema',
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  huespedId: number;

  @ApiProperty({
    description: 'Fecha de entrada en formato YYYY-MM-DD',
    example: '2026-11-20',
  })
  @IsDateString()
  fechaEntrada: string;

  @ApiProperty({
    description: 'Fecha de salida en formato YYYY-MM-DD',
    example: '2026-11-22',
  })
  @IsDateString()
  fechaSalida: string;

  @ApiProperty({
    description: 'Cantidad total de huéspedes',
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  cantidadHuespedes: number;

  @ApiProperty({
    description: 'Lista de IDs de las habitaciones que se reservarán',
    example: [1],
    type: [Number],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @Type(() => Number)
  @IsInt({ each: true })
  habitacionesIds: number[];

  @ApiPropertyOptional({
    description: 'Observaciones adicionales de la reserva',
    example: 'Reserva de prueba para verificar el sistema',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  observaciones?: string;
}
