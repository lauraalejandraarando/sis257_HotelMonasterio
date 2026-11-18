
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

import { Reserva } from './reserva.entity';
import { Habitacion } from './habitacion.entity';

@Entity('detalles_reserva')
export class DetalleReserva {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'precio_noche',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  precioNoche: number;

  @ManyToOne(() => Reserva, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reserva_id' })
  reserva: Reserva;

  @ManyToOne(() => Habitacion, { nullable: false })
  @JoinColumn({ name: 'habitacion_id' })
  habitacion: Habitacion;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;
}
