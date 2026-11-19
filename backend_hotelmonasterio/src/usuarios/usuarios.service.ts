
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes, scrypt } from 'crypto';
import { Usuario } from '../entities/usuario.entity';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';

// Modificado por Brayan
@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepo: Repository<Usuario>,
  ) {}

  private async protegerPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const hash = await new Promise<Buffer>((resolve, reject) => {
      scrypt(password, salt, 64, (error, resultado) => {
        if (error) reject(error);
        else resolve(resultado);
      });
    });
    return `${salt}:${hash.toString('hex')}`;
  }

  async crear(datos: CrearUsuarioDto) {
    const existente = await this.usuariosRepo.findOne({
      where: [{ nombreUsuario: datos.nombreUsuario }, { correo: datos.correo }],
    });

    if (existente) {
      throw new ConflictException('El nombre de usuario o correo ya existe');
    }

    const usuario = this.usuariosRepo.create({
      nombreUsuario: datos.nombreUsuario,
      passwordHash: await this.protegerPassword(datos.password),
      nombres: datos.nombres,
      apellidos: datos.apellidos,
      correo: datos.correo,
      rol: datos.rol || 'recepcion',
      activo: true,
    });

    const guardado = await this.usuariosRepo.save(usuario);

    // Modificado por Brayan: ocultar el hash de la respuesta
    const { passwordHash, ...respuesta } = guardado;
    return respuesta;
  }

  async obtenerTodos() {
    return this.usuariosRepo.find({ order: { id: 'ASC' } });
  }

  async obtenerPorId(id: number) {
    const usuario = await this.usuariosRepo.findOne({ where: { id } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    return usuario;
  }

  async actualizar(id: number, datos: ActualizarUsuarioDto) {
    const usuario = await this.obtenerPorId(id);

    if (datos.nombreUsuario && datos.nombreUsuario !== usuario.nombreUsuario) {
      const existe = await this.usuariosRepo.findOne({
        where: { nombreUsuario: datos.nombreUsuario },
      });
      if (existe) throw new ConflictException('El nombre de usuario ya existe');
    }

    if (datos.correo && datos.correo !== usuario.correo) {
      const existe = await this.usuariosRepo.findOne({
        where: { correo: datos.correo },
      });
      if (existe) throw new ConflictException('El correo ya existe');
    }

    const { password, ...campos } = datos;
    Object.assign(usuario, campos);

    if (password) {
      usuario.passwordHash = await this.protegerPassword(password);
    }

    const guardado = await this.usuariosRepo.save(usuario);

    // Modificado por Brayan: ocultar el hash de la respuesta
    const { passwordHash, ...respuesta } = guardado;
    return respuesta;
  }

  async desactivar(id: number) {
    const usuario = await this.obtenerPorId(id);
    usuario.activo = false;
    const guardado = await this.usuariosRepo.save(usuario);

    // Modificado por Brayan: ocultar el hash de la respuesta
    const { passwordHash, ...respuesta } = guardado;
    return respuesta;
  }
}
