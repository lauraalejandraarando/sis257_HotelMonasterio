
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

import { Usuario } from '../entities/usuario.entity';
import { SesionUsuario } from '../entities/sesion-usuario.entity';
import { UsuariosModule } from '../usuarios/usuarios.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Usuario, SesionUsuario]),
    UsuariosModule,

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '8h',
        },
      }),
    }),
  ],

  controllers: [AuthController],

  providers: [
    AuthService,
    JwtStrategy,
  ],

  exports: [
    AuthService,
    JwtModule,
  ],
})
export class AuthModule {}
