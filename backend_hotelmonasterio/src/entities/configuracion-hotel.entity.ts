
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('configuraciones_hotel')
@Index('UQ_configuracion_clave', ['clave'], { unique: true })
export class ConfiguracionHotel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'clave',
    type: 'varchar',
    length: 80,
  })
  clave: string;

  @Column({
    name: 'valor',
    type: 'varchar',
    length: 255,
  })
  valor: string;

  @Column({
    name: 'descripcion',
    type: 'text',
    nullable: true,
  })
  descripcion: string | null;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;
}
