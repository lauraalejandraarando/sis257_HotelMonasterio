import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

// Modificado por Brayan
export class CerrarTurnoDto {
  @ApiProperty({ example: 500 })
  @IsNumber()
  @Min(0)
  dineroContado: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  observaciones?: string;
}
