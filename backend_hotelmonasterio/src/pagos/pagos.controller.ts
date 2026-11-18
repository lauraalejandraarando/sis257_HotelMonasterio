
import {
  Controller,
  Get,
  Post,
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

import { PagosService } from './pagos.service';
import { CrearPagoDto } from './dto/crear-pago.dto';

@ApiTags('Pagos')
@Controller('pagos')
export class PagosController {
  constructor(
    private readonly pagosService: PagosService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Registrar un pago de una reserva',
    description:
      'Registra un adelanto o pago de saldo. Si la reserva está pendiente, se confirma automáticamente cuando el total pagado alcanza el 50 % del costo.',
  })
  @ApiResponse({
    status: 201,
    description: 'Pago registrado correctamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos, reserva cancelada o monto superior al saldo',
  })
  @ApiResponse({
    status: 404,
    description: 'Reserva no encontrada',
  })
  registrarPago(
    @Body() dto: CrearPagoDto,
  ) {
    return this.pagosService.registrarPago(dto);
  }

  @Get('reserva/:reservaId')
  @ApiOperation({
    summary: 'Consultar los pagos de una reserva',
  })
  @ApiParam({
    name: 'reservaId',
    example: 1,
    description: 'ID de la reserva',
  })
  async obtenerPagosPorReserva(
    @Param('reservaId', ParseIntPipe)
    reservaId: number,
  ) {
    const estadoCuenta =
      await this.pagosService.obtenerEstadoCuenta(
        reservaId,
      );

    return {
      reservaId: estadoCuenta.reservaId,
      codigoReserva: estadoCuenta.codigoReserva,
      totalPagado: estadoCuenta.totalPagado,
      pagos: await this.pagosService.obtenerPagosPorReserva(
        reservaId,
      ),
    };
  }

  @Get('estado-cuenta/:reservaId')
  @ApiOperation({
    summary: 'Consultar el estado de cuenta de una reserva',
    description:
      'Muestra el costo total, el mínimo del 50 % para confirmar, el monto pagado y el saldo pendiente.',
  })
  @ApiParam({
    name: 'reservaId',
    example: 1,
    description: 'ID de la reserva',
  })
  @ApiResponse({
    status: 200,
    description: 'Estado de cuenta consultado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Reserva no encontrada',
  })
  obtenerEstadoCuenta(
    @Param('reservaId', ParseIntPipe)
    reservaId: number,
  ) {
    return this.pagosService.obtenerEstadoCuenta(
      reservaId,
    );
  }
}
