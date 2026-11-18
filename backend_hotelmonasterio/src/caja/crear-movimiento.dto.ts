import {
  IsInt,
  IsString,
  IsNumber,
  IsIn,
  IsOptional,
  Min,
  MinLength,
} from 'class-validator';

import { Type } from 'class-transformer';

// Modificado por Brayan: DTO para registrar movimientos de caja
export class CrearMovimientoDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  turnoCajaId: number;

  @IsString()
  @IsIn(['ingreso', 'egreso'])
  tipoMovimiento: string;

  @IsString()
  @MinLength(1)
  concepto: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  monto: number;

  @IsString()
  @IsIn(['efectivo', 'tarjeta', 'transferencia'])
  metodoPago: string;

  @IsOptional()
  @IsString()
  referencia?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
