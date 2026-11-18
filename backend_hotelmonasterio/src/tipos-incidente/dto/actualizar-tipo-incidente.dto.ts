
import { PartialType } from '@nestjs/swagger';
import { CrearTipoIncidenteDto } from './crear-tipo-incidente.dto';

export class ActualizarTipoIncidenteDto extends PartialType(
  CrearTipoIncidenteDto,
) {}
