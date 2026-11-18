import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Modificado por Brayan
export class CreateHuespedDto {
  @ApiProperty({ example: 'Brayan Erick' })
  nombres: string;

  @ApiProperty({ example: 'Choque' })
  apellidos: string;

  @ApiProperty({ example: 'CI' })
  tipoDocumento: string;

  @ApiProperty({ example: '12345678' })
  numeroDocumento: string;

  @ApiProperty({ example: 'Boliviana' })
  nacionalidad: string;

  @ApiPropertyOptional({ example: '70000000' })
  telefono?: string;

  @ApiPropertyOptional({ example: 'correo@gmail.com' })
  correo?: string;

  @ApiPropertyOptional({ example: 'Sucre, Bolivia' })
  direccion?: string;
}