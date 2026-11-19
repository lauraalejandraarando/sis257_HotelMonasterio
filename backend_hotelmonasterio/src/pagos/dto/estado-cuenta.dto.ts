
import { ApiProperty } from '@nestjs/swagger';

export class EstadoCuentaDto {
  @ApiProperty({ example: 800, description: 'Costo total de la reserva en Bs' })
  totalReserva: number;

  @ApiProperty({ example: 400, description: 'Total pagado por el huésped en Bs' })
  totalPagado: number;

  @ApiProperty({ example: 400, description: 'Monto mínimo para confirmar la reserva en Bs' })
  minimoParaConfirmar: number;

  @ApiProperty({ example: 400, description: 'Saldo pendiente de pago en Bs' })
  saldoPendiente: number;

  @ApiProperty({ example: 50, description: 'Porcentaje del total que ya fue pagado' })
  porcentajePagado: number;

  @ApiProperty({

    
    example: true,
    description: 'Indica si el huésped ya pagó al menos el 50%',
  })
  pagoMinimoAlcanzado: boolean;

  @ApiProperty({
    example: 'confirmada',
    description: 'Estado actual de la reserva',
  })
  estadoReserva: string;
}
