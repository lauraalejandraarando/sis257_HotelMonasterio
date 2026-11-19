
import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import {
  scrypt,
  timingSafeEqual,
  randomUUID,
} from 'crypto';

import { Usuario } from '../entities/usuario.entity';
import { SesionUsuario } from '../entities/sesion-usuario.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepo: Repository<Usuario>,

    @InjectRepository(SesionUsuario)
    private readonly sesionesRepo: Repository<SesionUsuario>,

    private readonly jwtService: JwtService,
  ) {}

  // Comprobar que la contraseña coincida con el hash guardado
  private async verificarPassword(
    password: string,
    passwordHash: string,
  ): Promise<boolean> {
    const [salt, hashGuardado] = passwordHash.split(':');

    if (!salt || !hashGuardado) {
      return false;
    }

    const hashCalculado = await new Promise<Buffer>(
      (resolve, reject) => {
        scrypt(password, salt, 64, (error, resultado) => {
          if (error) reject(error);
          else resolve(resultado);
        });
      },
    );

    const hashOriginal = Buffer.from(hashGuardado, 'hex');

    if (hashCalculado.length !== hashOriginal.length) {
      return false;
    }

    return timingSafeEqual(hashCalculado, hashOriginal);
  }

  // Iniciar sesión
  async iniciarSesion(
    nombreUsuario: string,
    password: string,
    direccionIp?: string,
  ) {
    const usuario = await this.usuariosRepo
      .createQueryBuilder('usuario')
      .addSelect('usuario.passwordHash')
      .where('usuario.nombreUsuario = :nombreUsuario', {
        nombreUsuario,
      })
      .getOne();

    if (!usuario) {
      throw new UnauthorizedException(
        'Usuario o contraseña incorrectos',
      );
    }

    if (!usuario.activo) {
      throw new UnauthorizedException(
        'Esta cuenta se encuentra desactivada',
      );
    }

    const passwordValida = await this.verificarPassword(
      password,
      usuario.passwordHash,
    );

    if (!passwordValida) {
      throw new UnauthorizedException(
        'Usuario o contraseña incorrectos',
      );
    }

    // Identificador único de la sesión
    const tokenIdentificador = randomUUID();

    // Registrar la sesión en la base de datos
    const sesion = this.sesionesRepo.create({
      tokenIdentificador,
      usuario,
      estado: 'activa',
      direccionIp: direccionIp || null,
    });

    await this.sesionesRepo.save(sesion);

    // Actualizar último acceso
    usuario.ultimoAcceso = new Date();
    await this.usuariosRepo.save(usuario);

    // Generar token de acceso
    const token = await this.jwtService.signAsync({
      sub: usuario.id,
      nombreUsuario: usuario.nombreUsuario,
      rol: usuario.rol,
      sessionId: tokenIdentificador,
    });

    // No devolver la contraseña ni su hash
    return {
      mensaje: 'Inicio de sesión exitoso',
      access_token: token,
      usuario: {
        id: usuario.id,
        nombreUsuario: usuario.nombreUsuario,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    };
  }
}
