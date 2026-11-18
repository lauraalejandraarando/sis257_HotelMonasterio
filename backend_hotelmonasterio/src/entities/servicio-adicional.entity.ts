
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
import { TarifaServicio } from './tarifa-servicio.entity';

@Entity('servicios_adicionales')
@Index('IDX_servicios_adicionales_reserva', ['reserva'])
export class ServicioAdicional {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'cantidad',
    type: 'int',
  })
  cantidad: number;

  @Column({
    name: 'precio_unitario',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  precioUnitario: string;

  @Column({
    name: 'importe_total',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  importeTotal: string;

  @Column({
    name: 'fecha_servicio',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaServicio: Date;

  @Column({
    name: 'observaciones',
    type: 'text',
    nullable: true,
  })
  observaciones: string | null;

  @ManyToOne(() => Reserva, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'reserva_id' })
  reserva: Reserva;

  @ManyToOne(() => TarifaServicio, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'tarifa_servicio_id' })
  tarifaServicio: TarifaServicio;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;
}
