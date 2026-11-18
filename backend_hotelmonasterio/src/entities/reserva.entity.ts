
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Huesped } from './huesped.entity';
import { DetalleReserva } from './detalle-reserva.entity';

@Entity('reservas')
export class Reserva {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'codigo_reserva', length: 30, unique: true })
  codigoReserva: string;

  @Column({ name: 'fecha_entrada', type: 'date' })
  fechaEntrada: string;

  @Column({ name: 'fecha_salida', type: 'date' })
  fechaSalida: string;

  @Column({ name: 'cantidad_huespedes', type: 'int' })
  cantidadHuespedes: number;

  @Column({ length: 30, default: 'pendiente' })
  estado: string;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  // Fecha y hora límite para realizar el anticipo
  @Column({
    name: 'fecha_limite_pago',
    type: 'timestamptz',
    nullable: true,
  })
  fechaLimitePago: Date;

  @ManyToOne(() => Huesped, { nullable: false })
  @JoinColumn({ name: 'huesped_id' })
  huesped: Huesped;

  @OneToMany(
    () => DetalleReserva,
    (detalle) => detalle.reserva,
  )
  detalles: DetalleReserva[];

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;
}
