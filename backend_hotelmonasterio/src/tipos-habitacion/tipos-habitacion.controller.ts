
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

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { TiposHabitacionService } from './tipos-habitacion.service';
import { CrearTipoHabitacionDto } from './crear-tipo-habitacion.dto';
import { ActualizarTipoHabitacionDto } from './actualizar-tipo-habitacion.dto';

@ApiTags('Tipos de habitación')
@Controller('tipos-habitacion')
export class TiposHabitacionController {
  constructor(
    private readonly tiposHabitacionService: TiposHabitacionService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un tipo de habitación' })
  @ApiResponse({ status: 201, description: 'Tipo de habitación registrado' })
  create(@Body() datos: CrearTipoHabitacionDto) {
    return this.tiposHabitacionService.crear(datos);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los tipos de habitación' })
  findAll() {
    return this.tiposHabitacionService.obtenerTodos();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar un tipo de habitación por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tiposHabitacionService.obtenerPorId(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un tipo de habitación' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() datos: ActualizarTipoHabitacionDto,
  ) {
    return this.tiposHabitacionService.actualizar(id, datos);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar un tipo de habitación' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tiposHabitacionService.desactivar(id);
  }
}
