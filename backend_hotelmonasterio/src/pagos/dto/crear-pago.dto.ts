
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsPositive,
  IsNumber,
  IsString,
  IsNotEmpty,
  IsIn,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CrearPagoDto {
  @ApiProperty({
    example: 1,
    description: 'ID de la reserva a la que pertenece el pago',
  })
  @IsInt()
  @IsPositive()
  reservaId: number;

  @ApiProperty({
    example: 200,
    description: 'Monto que paga el huésped en bolivianos',
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  monto: number;

  @ApiProperty({
    example: 'efectivo',
    description: 'Método utilizado para realizar el pago',
    enum: ['efectivo', 'transferencia', 'tarjeta'],
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['efectivo', 'transferencia', 'tarjeta'])
  metodoPago: string;

  @ApiPropertyOptional({
    example: 'adelanto',
    description: 'Tipo de movimiento de pago',
    enum: ['adelanto', 'saldo'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['adelanto', 'saldo'])
  tipoPago?: string;

  @ApiPropertyOptional({
    example: 'TRF-2026-001',
    description: 'Número de referencia de la transacción',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  referencia?: string;

  @ApiPropertyOptional({
    example: 'Primer pago de la reserva',
    description: 'Observaciones adicionales',
  })
  @IsOptional()
  @IsString()
  observaciones?: string;
}
