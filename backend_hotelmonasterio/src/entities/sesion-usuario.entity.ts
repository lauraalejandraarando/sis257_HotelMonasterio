
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

import { Usuario } from './usuario.entity';

@Entity('sesiones_usuario')
@Index('IDX_sesiones_usuario_usuario', ['usuario'])
@Index('IDX_sesiones_usuario_estado', ['estado'])
export class SesionUsuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'token_identificador',
    type: 'varchar',
    length: 255,
    unique: true,
  })
  tokenIdentificador: string;

  @Column({
    name: 'fecha_inicio',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaInicio: Date;

  @Column({
    name: 'fecha_fin',
    type: 'timestamp',
    nullable: true,
  })
  fechaFin: Date | null;

  @Column({
    name: 'estado',
    type: 'varchar',
    length: 20,
    default: 'activa',
  })
  estado: string;

  @Column({
    name: 'direccion_ip',
    type: 'varchar',
    length: 45,
    nullable: true,
  })
  direccionIp: string | null;

  @ManyToOne(() => Usuario, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;
}
