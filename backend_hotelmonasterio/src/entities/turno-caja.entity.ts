
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

@Entity('turnos_caja')
@Index('IDX_turnos_caja_estado', ['estado'])
export class TurnoCaja {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'tipo_turno',
    type: 'varchar',
    length: 10,
  })
  tipoTurno: string;

  @Column({
    name: 'fecha_operativa',
    type: 'date',
  })
  fechaOperativa: string;

  @Column({
    name: 'fecha_apertura',
    type: 'timestamp',
  })
  fechaApertura: Date;

  @Column({
    name: 'fecha_cierre',
    type: 'timestamp',
    nullable: true,
  })
  fechaCierre: Date | null;

  @Column({
    name: 'monto_inicial',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  montoInicial: string;

  @Column({
    name: 'efectivo_esperado',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  efectivoEsperado: string | null;

  @Column({
    name: 'dinero_contado',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  dineroContado: string | null;

  @Column({
    name: 'diferencia',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  diferencia: string | null;

  @Column({
    name: 'estado',
    type: 'varchar',
    length: 15,
    default: 'abierto',
  })
  estado: string;

  @Column({
    name: 'observaciones',
    type: 'text',
    nullable: true,
  })
  observaciones: string | null;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;
}
