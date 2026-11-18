
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

import { Reserva } from './reserva.entity';

@Entity('pagos')
@Index('IDX_pagos_reserva', ['reserva'])
export class Pago {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'monto',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  monto: string;

  @Column({
    name: 'metodo_pago',
    type: 'varchar',
    length: 20,
  })
  metodoPago: string;

  @Column({
    name: 'tipo_pago',
    type: 'varchar',
    length: 20,
    default: 'adelanto',
  })
  tipoPago: string;

  @Column({
    name: 'referencia',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  referencia: string | null;

  @Column({
    name: 'observaciones',
    type: 'text',
    nullable: true,
  })
  observaciones: string | null;

  @ManyToOne(() => Reserva, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'reserva_id' })
  reserva: Reserva;

  @CreateDateColumn({ name: 'fecha_pago' })
  fechaPago: Date;
}
