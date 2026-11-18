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
  obtenerTodas() {
    return this.reservasService.obtenerTodas();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar una reserva por su ID' })
  @ApiParam({ name: 'id', type: Number })
  obtenerPorId(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.reservasService.obtenerPorId(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva reserva' })
  crear(@Body() dto: CrearReservaDto) {
    return this.reservasService.crear(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una reserva existente' })
  @ApiParam({ name: 'id', type: Number })
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarReservaDto,
  ) {
    return this.reservasService.actualizar(id, dto);
  }

  // Modificado por Brayan: realizar check-in
  @Patch(':id/check-in')
  @ApiOperation({ summary: 'Realizar check-in de una reserva' })
  @ApiParam({ name: 'id', type: Number })
  checkIn(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.reservasService.realizarCheckIn(id);
  }

  // Modificado por Brayan: realizar check-out
  @Patch(':id/check-out')
  @ApiOperation({ summary: 'Realizar check-out de una reserva' })
  @ApiParam({ name: 'id', type: Number })
  checkOut(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.reservasService.realizarCheckOut(id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Cancelar una reserva sin eliminar su historial',
  })
  @ApiParam({ name: 'id', type: Number })
  eliminar(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.reservasService.actualizar(id, {
      estado: 'cancelada',
    });
  }
}
