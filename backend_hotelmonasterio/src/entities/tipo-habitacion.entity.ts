
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tipos_habitacion')
export class TipoHabitacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ type: 'int' })
  capacidad: number;

  @Column({ name: 'tipo_bano', length: 20 })
  tipoBano: string;

  @Column({
    name: 'precio_noche',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  precioNoche: number;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;
}
