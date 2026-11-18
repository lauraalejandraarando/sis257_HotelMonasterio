
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

import { Huesped } from './huesped.entity';
import { Reserva } from './reserva.entity';

@Entity('guardas_equipaje')
@Index('IDX_guardas_equipaje_huesped', ['huesped'])
@Index('IDX_guardas_equipaje_estado', ['estado'])
export class GuardaEquipaje {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'fecha_recepcion',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaRecepcion: Date;

  @Column({
    name: 'fecha_entrega',
    type: 'timestamp',
    nullable: true,
  })
  fechaEntrega: Date | null;

  @Column({
    name: 'estado',
    type: 'varchar',
    length: 20,
    default: 'en_custodia',
  })
  estado: string;

  @Column({
    name: 'observaciones',
    type: 'text',
    nullable: true,
  })
  observaciones: string | null;

  @ManyToOne(() => Huesped, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'huesped_id' })
  huesped: Huesped;

  @ManyToOne(() => Reserva, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'reserva_id' })
  reserva: Reserva | null;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;
}
