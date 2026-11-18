
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

@Entity('solicitudes_mantenimiento')
@Index('IDX_mantenimiento_habitacion', ['habitacion'])
@Index('IDX_mantenimiento_estado', ['estado'])
export class SolicitudMantenimiento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'tipo_problema',
    type: 'varchar',
    length: 80,
  })
  tipoProblema: string;

  @Column({
    name: 'descripcion',
    type: 'text',
  })
  descripcion: string;

  @Column({
    name: 'prioridad',
    type: 'varchar',
    length: 15,
    default: 'media',
  })
  prioridad: string;

  @Column({
    name: 'estado',
    type: 'varchar',
    length: 20,
    default: 'pendiente',
  })
  estado: string;

  @Column({
    name: 'fecha_reporte',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaReporte: Date;

  @Column({
    name: 'fecha_solucion',
    type: 'timestamp',
    nullable: true,
  })
  fechaSolucion: Date | null;

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
