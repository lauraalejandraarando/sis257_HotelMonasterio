import { PartialType } from '@nestjs/swagger';
import { CrearServicioAdicionalDto } from './crear-servicio-adicional.dto';

export class ActualizarServicioAdicionalDto extends PartialType(
  CrearServicioAdicionalDto,
) {}

