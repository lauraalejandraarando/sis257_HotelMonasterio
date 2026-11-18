
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Huesped } from './huesped.entity';

@Entity('reservas')
export class Reserva {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'codigo_reserva', length: 30, unique: true })
  codigoReserva: string;

  @Column({ name: 'fecha_entrada', type: 'date' })
  fechaEntrada: Date;

  @Column({ name: 'fecha_salida', type: 'date' })
  fechaSalida: Date;

  @Column({ name: 'cantidad_huespedes', type: 'int' })
  cantidadHuespedes: number;

  @Column({ length: 30, default: 'pendiente' })
  estado: string;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @ManyToOne(() => Huesped, { nullable: false })
  @JoinColumn({ name: 'huesped_id' })
  huesped: Huesped;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;
}
