
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TipoHabitacion } from './entities/tipo-habitacion.entity';
import { Habitacion } from './entities/habitacion.entity';
import { Huesped } from './entities/huesped.entity';
import { Reserva } from './entities/reserva.entity';
import { DetalleReserva } from './entities/detalle-reserva.entity';
import { Pago } from './entities/pago.entity';
import { TurnoCaja } from './entities/turno-caja.entity';
import { MovimientoCaja } from './entities/movimiento-caja.entity';
import { TareaLimpieza } from './entities/tarea-limpieza.entity';
import { SolicitudMantenimiento } from './entities/solicitud-mantenimiento.entity';
import { ConfiguracionHotel } from './entities/configuracion-hotel.entity';
import { TarifaServicio } from './entities/tarifa-servicio.entity';
import { ServicioAdicional } from './entities/servicio-adicional.entity';
import { GuardaEquipaje } from './entities/guarda-equipaje.entity';
import { DetalleEquipaje } from './entities/detalle-equipaje.entity';
import { TipoIncidente } from './entities/tipo-incidente.entity';
import { Incidente } from './entities/incidente.entity';
import { Usuario } from './entities/usuario.entity';
import { RegistroAuditoria } from './entities/registro-auditoria.entity';
import { SesionUsuario } from './entities/sesion-usuario.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [
        TipoHabitacion,
        Habitacion,
        Huesped,
        Reserva,
        DetalleReserva,
        Pago,
        TurnoCaja,
        MovimientoCaja,
        TareaLimpieza,
        SolicitudMantenimiento,
        ConfiguracionHotel,
        TarifaServicio,
        ServicioAdicional,
        GuardaEquipaje,
        DetalleEquipaje,
        TipoIncidente,
        Incidente,
        Usuario,
        RegistroAuditoria,
        SesionUsuario,
      ],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
