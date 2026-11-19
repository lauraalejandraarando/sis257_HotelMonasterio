
import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SesionUsuario } from '../entities/sesion-usuario.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,

    @InjectRepository(SesionUsuario)
    private readonly sesionesRepository: Repository<SesionUsuario>,
  ) {
    const secret = configService.get<string>('JWT_SECRET');

    if (!secret) {
      throw new Error('JWT_SECRET no está configurado');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    if (!payload.sub || !payload.sessionId) {
      throw new UnauthorizedException('Token inválido');
    }

    const sesion = await this.sesionesRepository.findOne({
      where: {
        tokenIdentificador: payload.sessionId,
        estado: 'activa',
      },
      relations: {
        usuario: true,
      },
    });

    if (!sesion) {
      throw new UnauthorizedException(
        'La sesión no existe o ya no está activa',
      );
    }

    if (sesion.fechaFin !== null) {
      throw new UnauthorizedException(
        'La sesión ha finalizado',
      );
    }

    if (!sesion.usuario || !sesion.usuario.activo) {
      throw new UnauthorizedException(
        'El usuario está desactivado',
      );
    }

    if (sesion.usuario.id !== Number(payload.sub)) {
      throw new UnauthorizedException(
        'El usuario no corresponde a esta sesión',
      );
    }

    return {
      id: sesion.usuario.id,
      nombreUsuario: sesion.usuario.nombreUsuario,
      rol: sesion.usuario.rol,
      sessionId: sesion.tokenIdentificador,
    };
  }
}
