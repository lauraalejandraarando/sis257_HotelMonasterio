
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

import { HabitacionesService } from './habitaciones.service';

// Modificado por Brayan
@ApiTags('Habitaciones')
@Controller('habitaciones')
export class HabitacionesController {
  constructor(
    private readonly habitacionesService: HabitacionesService,
  ) {}

  @Get()
  findAll() {
    return this.habitacionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.habitacionesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una habitacion' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        numero: { type: 'string', example: '101' },
        piso: { type: 'number', example: 1 },
        estado: { type: 'string', example: 'disponible' },
        observaciones: { type: 'string', example: 'Habitacion de prueba' },
        tipoHabitacionId: { type: 'number', example: 1 },
      },
      required: ['numero', 'piso', 'tipoHabitacionId'],
    },
  })
  create(@Body() data: any) {
    return this.habitacionesService.create(data);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: any,
  ) {
    return this.habitacionesService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.habitacionesService.remove(id);
  }
}
