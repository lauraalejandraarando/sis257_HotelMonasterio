
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('tarifas_servicios')
@Index('IDX_tarifas_servicios_activo', ['activo'])
export class TarifaServicio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'nombre',
    type: 'varchar',
    length: 100,
    unique: true,
  })
  nombre: string;

  @Column({
    name: 'descripcion',
    type: 'text',
    nullable: true,
  })
  descripcion: string | null;

  @Column({
    name: 'precio',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  precio: string;

  @Column({
    name: 'unidad_cobro',
    type: 'varchar',
    length: 50,
  })
  unidadCobro: string;

  @Column({
    name: 'activo',
    type: 'boolean',
    default: true,
  })
  activo: boolean;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;
}

