
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

import { TipoIncidente } from './tipo-incidente.entity';
import { Huesped } from './huesped.entity';
import { Reserva } from './reserva.entity';
import { Habitacion } from './habitacion.entity';

@Entity('incidentes')
@Index('IDX_incidentes_estado', ['estado'])
@Index('IDX_incidentes_fecha', ['fechaReporte'])
export class Incidente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'descripcion',
    type: 'text',
  })
  descripcion: string;

  @Column({
    name: 'monto_estimado',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  montoEstimado: string;

  @Column({
    name: 'monto_autorizado',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  montoAutorizado: string | null;

  @Column({
    name: 'estado',
    type: 'varchar',
    length: 25,
    default: 'reportado',
  })
  estado: string;

  @Column({
    name: 'fecha_reporte',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaReporte: Date;

  @Column({
    name: 'fecha_resolucion',
    type: 'timestamp',
    nullable: true,
  })
  fechaResolucion: Date | null;

  @Column({
    name: 'observaciones',
    type: 'text',
    nullable: true,
  })
  observaciones: string | null;

  @ManyToOne(() => TipoIncidente, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'tipo_incidente_id' })
  tipoIncidente: TipoIncidente;

  @ManyToOne(() => Huesped, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'huesped_id' })
  huesped: Huesped;

  @ManyToOne(() => Reserva, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'reserva_id' })
  reserva: Reserva | null;

  @ManyToOne(() => Habitacion, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'habitacion_id' })
  habitacion: Habitacion | null;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;
}
