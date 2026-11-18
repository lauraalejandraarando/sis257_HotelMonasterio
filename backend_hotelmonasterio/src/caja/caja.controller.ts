
import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { CajaService } from './caja.service';
import { AbrirTurnoDto } from './abrir-turno.dto';
import { CerrarTurnoDto } from './cerrar-turno.dto';
import { CrearMovimientoDto } from './crear-movimiento.dto';

// Modificado por Brayan
@ApiTags('Caja')
@Controller('caja')
export class CajaController {
  constructor(private readonly cajaService: CajaService) {}

  @Get('turnos')
  @ApiOperation({ summary: 'Listar turnos de caja' })
  obtenerTurnos() {
    return this.cajaService.obtenerTurnos();
  }

  @Get('turnos/:id')
  @ApiOperation({ summary: 'Consultar turno de caja' })
  obtenerTurno(@Param('id', ParseIntPipe) id: number) {
    return this.cajaService.obtenerTurnoPorId(id);
  }

  @Post('turnos/abrir')
  @ApiOperation({ summary: 'Abrir turno de caja' })
  abrirTurno(@Body() dto: AbrirTurnoDto) {
    return this.cajaService.abrirTurno(dto);
  }

  @Patch('turnos/:id/cerrar')
  @ApiOperation({ summary: 'Cerrar turno de caja' })
  cerrarTurno(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CerrarTurnoDto,
  ) {
    return this.cajaService.cerrarTurno(id, dto);
  }

  @Post('movimientos')
  @ApiOperation({ summary: 'Registrar ingreso o egreso' })
  crearMovimiento(@Body() dto: CrearMovimientoDto) {
    return this.cajaService.crearMovimiento(dto);
  }

  @Get('turnos/:id/movimientos')
  @ApiOperation({ summary: 'Consultar movimientos de un turno' })
  obtenerMovimientos(@Param('id', ParseIntPipe) id: number) {
    return this.cajaService.obtenerMovimientos(id);
  }
}
