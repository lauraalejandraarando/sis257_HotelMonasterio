import { PartialType } from '@nestjs/swagger';
import { CrearUsuarioDto } from './crear-usuario.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class ActualizarUsuarioDto extends PartialType(CrearUsuarioDto) {
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
