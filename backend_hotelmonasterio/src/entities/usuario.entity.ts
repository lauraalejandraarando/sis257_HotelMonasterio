
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('usuarios')
@Index('UQ_usuarios_nombre_usuario', ['nombreUsuario'], {
  unique: true,
})
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'nombre_usuario',
    type: 'varchar',
    length: 50,
    unique: true,
  })
  nombreUsuario: string;

  @Column({
    name: 'password_hash',
    type: 'varchar',
    length: 255,
    select: false,
  })
  passwordHash: string;

  @Column({
    name: 'nombres',
    type: 'varchar',
    length: 100,
  })
  nombres: string;

  @Column({
    name: 'apellidos',
    type: 'varchar',
    length: 100,
  })
  apellidos: string;

  @Column({
    name: 'correo',
    type: 'varchar',
    length: 120,
    unique: true,
  })
  correo: string;

  @Column({
    name: 'rol',
    type: 'varchar',
    length: 20,
    default: 'recepcion',
  })
  rol: string;

  @Column({
    name: 'activo',
    type: 'boolean',
    default: true,
  })
  activo: boolean;

  @Column({
    name: 'ultimo_acceso',
    type: 'timestamp',
    nullable: true,
  })
  ultimoAcceso: Date | null;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;
}
