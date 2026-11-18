
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

import { Habitacion } from './habitacion.entity';

@Entity('tareas_limpieza')
@Index('IDX_tareas_limpieza_habitacion', ['habitacion'])
@Index('IDX_tareas_limpieza_estado', ['estado'])
export class TareaLimpieza {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'tipo_limpieza',
    type: 'varchar',
    length: 50,
  })
  tipoLimpieza: string;

  @Column({
    name: 'estado',
    type: 'varchar',
    length: 20,
    default: 'pendiente',
  })
  estado: string;

  @Column({
    name: 'fecha_asignacion',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaAsignacion: Date;

  @Column({
    name: 'fecha_finalizacion',
    type: 'timestamp',
    nullable: true,
  })
  fechaFinalizacion: Date | null;

  @Column({
    name: 'observaciones',
    type: 'text',
    nullable: true,
  })
  observaciones: string | null;

  @ManyToOne(() => Habitacion, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'habitacion_id' })
  habitacion: Habitacion;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;
}
