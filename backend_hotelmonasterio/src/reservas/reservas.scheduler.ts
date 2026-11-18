
import {
  Injectable,
  Logger,
} from '@nestjs/common';

import { Cron } from '@nestjs/schedule';

import { PagosService } from '../pagos/pagos.service';

@Injectable()
export class ReservasScheduler {
  private readonly logger = new Logger(
    ReservasScheduler.name,
  );

  constructor(
    private readonly pagosService: PagosService,
  ) {}

  // Ejecutar la revisión automáticamente cada minuto
  @Cron('* * * * *')
  async revisarReservasVencidas() {
    try {
      const cantidadCanceladas =
        await this.pagosService.cancelarReservasVencidas();

      if (cantidadCanceladas > 0) {
        this.logger.log(
          `Se cancelaron automáticamente ${cantidadCanceladas} reserva(s) por vencimiento del plazo de pago.`,
        );
      }
    } catch (error) {
      this.logger.error(
        'Error al revisar las reservas vencidas.',
        error instanceof Error
          ? error.stack
          : String(error),
      );
    }
  }
}
