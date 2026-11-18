
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

import { TurnoCaja } from './turno-caja.entity';

@Entity('movimientos_caja')
@Index('IDX_movimientos_caja_turno', ['turnoCaja'])
export class MovimientoCaja {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'tipo_movimiento',
    type: 'varchar',
    length: 10,
  })
  tipoMovimiento: string;

  @Column({
    name: 'concepto',
    type: 'varchar',
    length: 150,
  })
  concepto: string;

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

  @ManyToOne(() => TurnoCaja, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'turno_caja_id' })
  turnoCaja: TurnoCaja;

  @CreateDateColumn({ name: 'fecha_movimiento' })
  fechaMovimiento: Date;
}
