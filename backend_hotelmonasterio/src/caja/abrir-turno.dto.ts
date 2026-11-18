import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

// Modificado por Brayan
export class AbrirTurnoDto {
  @ApiProperty({ example: 'mañana', enum: ['mañana', 'tarde', 'noche'] })
  @IsString()
  @IsIn(['mañana', 'tarde', 'noche'])
  tipoTurno: string;

  @ApiProperty({ example: '2026-11-18' })
  @IsString()
  fechaOperativa: string;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0)
  montoInicial: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  observaciones?: string;
}
