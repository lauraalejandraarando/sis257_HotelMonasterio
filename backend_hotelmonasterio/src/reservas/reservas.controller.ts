
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

import { ReservasService } from './reservas.service';
import { CrearReservaDto } from './crear-reserva.dto';
import { ActualizarReservaDto } from './actualizar-reserva.dto';

@ApiTags('Reservas')
@Controller('reservas')
export class ReservasController {
  constructor(
    private readonly reservasService: ReservasService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Consultar todas las reservas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de reservas obtenida correctamente',
  })
  obtenerTodas() {
    return this.reservasService.obtenerTodas();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar una reserva por su ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Reserva encontrada',
  })
  @ApiResponse({
    status: 404,
    description: 'Reserva no encontrada',
  })
  obtenerPorId(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.reservasService.obtenerPorId(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva reserva' })
  @ApiResponse({
    status: 201,
    description: 'Reserva creada correctamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de reserva inválidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Huésped o habitación no encontrados',
  })
  @ApiResponse({
    status: 409,
    description: 'Habitación ocupada para esas fechas',
  })
  crear(@Body() dto: CrearReservaDto) {
    return this.reservasService.crear(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una reserva existente' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Reserva actualizada correctamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de reserva inválidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Reserva no encontrada',
  })
  @ApiResponse({
    status: 409,
    description: 'Habitación ocupada para esas fechas',
  })
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarReservaDto,
  ) {
    return this.reservasService.actualizar(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Cancelar una reserva sin eliminar su historial',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Reserva cancelada correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Reserva no encontrada',
  })
  eliminar(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.reservasService.actualizar(id, {
      estado: 'cancelada',
    });
  }
}
