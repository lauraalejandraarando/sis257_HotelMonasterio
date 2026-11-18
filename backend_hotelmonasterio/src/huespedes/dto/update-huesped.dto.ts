import { PartialType } from '@nestjs/swagger';
import { CreateHuespedDto } from './create-huesped.dto';

// Modificado por Brayan
export class UpdateHuespedDto extends PartialType(CreateHuespedDto) {}