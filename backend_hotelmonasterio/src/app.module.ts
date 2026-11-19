
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD } from '@nestjs/core';

// Modificado por Brayan: seguridad y autenticacion
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

// Modulos desarrollados por Brayan
import { HabitacionesModule } from './habitaciones/habitaciones.module';
import { HuespedesModule } from './huespedes/huespedes.module';
import { CajaModule } from './caja/caja.module';
import { ReportesModule } from './reportes/reportes.module';
import { UsuariosModule } from './usuarios/usuarios.module';

// Modulos desarrollados por Laura
import { TiposHabitacionModule } from './tipos-habitacion/tipos-habitacion.module';
import { ReservasModule } from './reservas/reservas.module';
import { PagosModule } from './pagos/pagos.module';

// Controlador y servicio principal
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Entidades
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
import { Usuario } from './entities/usuario.entity';
import { RegistroAuditoria } from './entities/registro-auditoria.entity';
import { SesionUsuario } from './entities/sesion-usuario.entity';

// Modificado por Brayan
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ScheduleModule.forRoot(),

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
        Usuario,
        RegistroAuditoria,
        SesionUsuario,
      ],
      synchronize: true,
    }),

    HabitacionesModule,
    HuespedesModule,
    CajaModule,
    ReportesModule,
    UsuariosModule,
    TiposHabitacionModule,
    ReservasModule,
    PagosModule,

    // Modificado por Brayan: registro del modulo de autenticacion
    AuthModule,
  ],

  controllers: [AppController],

  // Modificado por Brayan: proteccion global mediante JWT
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
