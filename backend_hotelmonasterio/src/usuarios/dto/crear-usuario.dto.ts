import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CrearUsuarioDto {
  @ApiProperty({ example: 'brayan' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nombreUsuario: string;

  @ApiProperty({ example: 'ClaveSegura123' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'Brayan' })
  @IsString()
  @IsNotEmpty()
  nombres: string;

  @ApiProperty({ example: 'Choque' })
  @IsString()
  @IsNotEmpty()
  apellidos: string;

  @ApiProperty({ example: 'brayan@gmail.com' })
  @IsEmail()
  correo: string;

  @ApiPropertyOptional({ enum: ['administrador', 'recepcion', 'gerencia'] })
  @IsOptional()
  @IsIn(['administrador', 'recepcion', 'gerencia'])
  rol?: string;
}
