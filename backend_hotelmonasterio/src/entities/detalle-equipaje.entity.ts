
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

import { GuardaEquipaje } from './guarda-equipaje.entity';

@Entity('detalles_equipaje')
@Index('UQ_detalle_equipaje_codigo', ['codigo'], { unique: true })
@Index('IDX_detalle_equipaje_estado', ['estado'])
export class DetalleEquipaje {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'codigo',
    type: 'varchar',
    length: 30,
    unique: true,
  })
  codigo: string;

  @Column({
    name: 'descripcion',
    type: 'varchar',
    length: 200,
  })
  descripcion: string;

  @Column({
    name: 'estado',
    type: 'varchar',
    length: 20,
    default: 'en_custodia',
  })
  estado: string;

  @Column({
    name: 'fecha_entrega',
    type: 'timestamp',
    nullable: true,
  })
  fechaEntrega: Date | null;

  @Column({
    name: 'observaciones',
    type: 'text',
    nullable: true,
  })
  observaciones: string | null;

  @ManyToOne(() => GuardaEquipaje, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'guarda_equipaje_id' })
  guardaEquipaje: GuardaEquipaje;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;
}
