
import { PartialType } from '@nestjs/swagger';
import { CrearTipoHabitacionDto } from './crear-tipo-habitacion.dto';

export class ActualizarTipoHabitacionDto extends PartialType(
  CrearTipoHabitacionDto,
) {}
