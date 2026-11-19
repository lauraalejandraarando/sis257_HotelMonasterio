
import {
  Controller,
  Get,
  Post,
  Patch,
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

import { CajaService } from './caja.service';
import { AbrirTurnoDto } from './abrir-turno.dto';
import { CerrarTurnoDto } from './cerrar-turno.dto';
import { CrearMovimientoDto } from './crear-movimiento.dto';

@ApiTags('Caja')
@Controller('caja')
export class CajaController {
  constructor(
    private readonly cajaService: CajaService,
  ) {}

  @Get('turnos')
  @ApiOperation({ summary: 'Consultar todos los turnos de caja' })
  obtenerTurnos() {
    return this.cajaService.obtenerTurnos();
  }

  @Get('turnos/:id')
  @ApiOperation({ summary: 'Consultar un turno de caja por ID' })
  @ApiParam({ name: 'id', type: Number })
  obtenerTurnoPorId(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.cajaService.obtenerTurnoPorId(id);
  }

  @Post('turnos/abrir')
  @ApiOperation({ summary: 'Abrir un turno de caja' })
  @ApiResponse({ status: 201, description: 'Turno abierto correctamente' })
  abrirTurno(@Body() dto: AbrirTurnoDto) {
    return this.cajaService.abrirTurno(dto);
  }

  @Patch('turnos/:id/cerrar')
  @ApiOperation({ summary: 'Cerrar un turno de caja' })
  @ApiParam({ name: 'id', type: Number })
  cerrarTurno(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CerrarTurnoDto,
  ) {
    return this.cajaService.cerrarTurno(id, dto);
  }

  @Post('movimientos')
  @ApiOperation({ summary: 'Registrar un movimiento de caja' })
  registrarMovimiento(@Body() dto: CrearMovimientoDto) {
  return this.cajaService.crearMovimiento(dto);
  }

  @Get('turnos/:id/movimientos')
  @ApiOperation({ summary: 'Consultar movimientos de un turno' })
  @ApiParam({ name: 'id', type: Number })
  obtenerMovimientos(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.cajaService.obtenerMovimientos(id);
  }
}
