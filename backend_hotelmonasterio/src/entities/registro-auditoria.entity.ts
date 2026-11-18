
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

@Entity('registros_auditoria')
@Index('IDX_auditoria_usuario', ['usuario'])
@Index('IDX_auditoria_fecha', ['fechaAccion'])
@Index('IDX_auditoria_entidad', ['entidad', 'entidadId'])
export class RegistroAuditoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'accion',
    type: 'varchar',
    length: 50,
  })
  accion: string;

  @Column({
    name: 'entidad',
    type: 'varchar',
    length: 80,
  })
  entidad: string;

  @Column({
    name: 'entidad_id',
    type: 'int',
    nullable: true,
  })
  entidadId: number | null;

  @Column({
    name: 'datos_anteriores',
    type: 'jsonb',
    nullable: true,
  })
  datosAnteriores: Record<string, any> | null;

  @Column({
    name: 'datos_nuevos',
    type: 'jsonb',
    nullable: true,
  })
  datosNuevos: Record<string, any> | null;

  @Column({
    name: 'descripcion',
    type: 'text',
    nullable: true,
  })
  descripcion: string | null;

  @Column({
    name: 'fecha_accion',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaAccion: Date;

  @ManyToOne(() => Usuario, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario | null;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;
}
