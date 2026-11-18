
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  MaxLength,
} from 'class-validator';

export class CreateHuespedDto {
  @ApiProperty({ example: 'Brayan Erick' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombres: string;

  @ApiProperty({ example: 'Choque' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  apellidos: string;

  @ApiProperty({ example: 'CI' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  tipoDocumento: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  numeroDocumento: string;

  @ApiProperty({ example: 'Boliviana' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  nacionalidad: string;

  @ApiPropertyOptional({ example: '70000000' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  telefono?: string;

  @ApiPropertyOptional({ example: 'correo@gmail.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(120)
  correo?: string;

  @ApiPropertyOptional({ example: 'Sucre, Bolivia' })
  @IsOptional()
  @IsString()
  direccion?: string;
}
