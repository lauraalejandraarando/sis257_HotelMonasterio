
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('tipos_incidente')
@Index('UQ_tipos_incidente_nombre', ['nombre'], { unique: true })
export class TipoIncidente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'nombre',
    type: 'varchar',
    length: 80,
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
    name: 'requiere_cobro',
    type: 'boolean',
    default: true,
  })
  requiereCobro: boolean;

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
