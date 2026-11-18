
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('huespedes')
export class Huesped {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nombres', length: 100 })
  nombres: string;

  @Column({ name: 'apellidos', length: 100 })
  apellidos: string;

  @Column({ name: 'tipo_documento', length: 20 })
  tipoDocumento: string;

  @Column({ name: 'numero_documento', length: 30, unique: true })
  numeroDocumento: string;

  @Column({ length: 60 })
  nacionalidad: string;

  @Column({ length: 30, nullable: true })
  telefono: string;

  @Column({ length: 120, nullable: true })
  correo: string;

  @Column({ type: 'text', nullable: true })
  direccion: string;

  // Modificado por Brayan
  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;
}
