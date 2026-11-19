
import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ReportesService } from './reportes.service';

// Modificado por Brayan
@ApiTags('Reportes')
@Controller('reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  @Get('resumen')
  @ApiOperation({ summary: 'Obtener resumen general del hotel' })
  obtenerResumen() {
    return this.reportesService.obtenerResumen();
  }

  @Get('reservas')
  @ApiOperation({ summary: 'Obtener reporte de reservas' })
  obtenerReservas() {
    return this.reportesService.obtenerReservas();
  }

  @Get('ingresos')
  @ApiOperation({ summary: 'Obtener reporte de ingresos por pagos' })
  @ApiQuery({ name: 'desde', required: false, example: '2026-11-01' })
  @ApiQuery({ name: 'hasta', required: false, example: '2026-11-30' })
  obtenerIngresos(
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
  ) {
    return this.reportesService.obtenerIngresos(desde, hasta);
  }

  @Get('ocupacion')
  @ApiOperation({ summary: 'Obtener reporte de ocupacion de habitaciones' })
  obtenerOcupacion() {
    return this.reportesService.obtenerOcupacion();
  }

  @Get('reservas/estado')
  @ApiOperation({ summary: 'Obtener cantidad de reservas agrupadas por estado' })
  obtenerReservasPorEstado() {
    return this.reportesService.obtenerReservasPorEstado();
  }
}
