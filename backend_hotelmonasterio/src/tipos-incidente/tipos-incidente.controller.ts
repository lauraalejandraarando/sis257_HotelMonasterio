
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

import { TiposIncidenteService } from './tipos-incidente.service';
import { CrearTipoIncidenteDto } from './dto/crear-tipo-incidente.dto';
import { ActualizarTipoIncidenteDto } from './dto/actualizar-tipo-incidente.dto';

@ApiTags('Tipos de Incidente')
@Controller('tipos-incidente')
export class TiposIncidenteController {
  constructor(
    private readonly tiposIncidenteService: TiposIncidenteService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un nuevo tipo de incidente' })
  @ApiResponse({ status: 201, description: 'Tipo de incidente creado correctamente' })
  @ApiResponse({ status: 409, description: 'Ya existe un tipo con ese nombre' })
  crear(@Body() datos: CrearTipoIncidenteDto) {
    return this.tiposIncidenteService.crear(datos);
  }

  @Get()
  @ApiOperation({ summary: 'Consultar todos los tipos de incidente' })
  obtenerTodos() {
    return this.tiposIncidenteService.obtenerTodos();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar un tipo de incidente por ID' })
  @ApiParam({ name: 'id', example: 1 })
  obtenerPorId(@Param('id', ParseIntPipe) id: number) {
    return this.tiposIncidenteService.obtenerPorId(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un tipo de incidente' })
  @ApiParam({ name: 'id', example: 1 })
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() datos: ActualizarTipoIncidenteDto,
  ) {
    return this.tiposIncidenteService.actualizar(id, datos);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar un tipo de incidente' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Tipo de incidente desactivado correctamente' })
  desactivar(@Param('id', ParseIntPipe) id: number) {
    return this.tiposIncidenteService.desactivar(id);
  }
}
