
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CrearTipoIncidenteDto {
  @ApiProperty({
    example: 'Daño a mobiliario',
    description: 'Nombre del tipo de incidente',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  nombre: string;

  @ApiPropertyOptional({
    example: 'Daños ocasionados a muebles o instalaciones del hotel',
    description: 'Descripción del tipo de incidente',
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Indica si este tipo de incidente requiere cobro',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  requiereCobro?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: 'Indica si el tipo de incidente está activo',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
