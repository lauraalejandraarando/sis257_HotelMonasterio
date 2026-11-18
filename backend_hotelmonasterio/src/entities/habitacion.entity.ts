
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { TipoHabitacion } from './tipo-habitacion.entity';

@Entity('habitaciones')
export class Habitacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, unique: true })
  numero: string;

  @Column({ type: 'int' })
  piso: number;

  @Column({ length: 30, default: 'disponible' })
  estado: string;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @ManyToOne(() => TipoHabitacion, { nullable: false })
  @JoinColumn({ name: 'tipo_habitacion_id' })
  tipoHabitacion: TipoHabitacion;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;
}
