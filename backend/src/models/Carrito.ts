import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Usuario } from "./Usuario";

@Entity()
export class Carrito {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: "id_usuario" })
  usuario!: Usuario;

  @Column()
  id_usuario!: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @Column({ nullable: true })
  id_pelicula!: number;

  @Column({ nullable: true })
  id_serie!: number;

  @Column("int")
  cantidad!: number;
}
