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

import { ServiciosAdicionalesService } from './servicios-adicionales.service';
import { CrearServicioAdicionalDto } from './crear-servicio-adicional.dto';
import { ActualizarServicioAdicionalDto } from './actualizar-servicio-adicional.dto';

@ApiTags('Servicios adicionales')
@Controller('servicios-adicionales')
export class ServiciosAdicionalesController {
  constructor(
    private readonly serviciosService: ServiciosAdicionalesService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los servicios adicionales' })
  obtenerTodos() {
    return this.serviciosService.obtenerTodos();
  }

  @Get('reserva/:reservaId')
  @ApiOperation({ summary: 'Listar servicios de una reserva' })
  obtenerPorReserva(
    @Param('reservaId', ParseIntPipe) reservaId: number,
  ) {
    return this.serviciosService.obtenerPorReserva(reservaId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar servicio adicional por ID' })
  @ApiParam({ name: 'id', type: Number })
  obtenerPorId(@Param('id', ParseIntPipe) id: number) {
    return this.serviciosService.obtenerPorId(id);
  }

  @Post()
  @ApiOperation({ summary: 'Registrar servicio adicional' })
  @ApiResponse({ status: 201, description: 'Servicio registrado' })
  crear(@Body() dto: CrearServicioAdicionalDto) {
    return this.serviciosService.crear(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar servicio adicional' })
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarServicioAdicionalDto,
  ) {
    return this.serviciosService.actualizar(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar servicio adicional' })
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.serviciosService.eliminar(id);
  }
}