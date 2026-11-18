import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

export class CrearServicioAdicionalDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  reservaId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  tarifaServicioId: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @IsPositive()
  cantidad: number;

  @ApiProperty({ example: 'Servicio solicitado por el huésped', required: false })
  @IsOptional()
  @IsString()
  observaciones?: string;
}