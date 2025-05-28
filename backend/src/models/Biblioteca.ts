import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BaseEntity } from "typeorm";
import { Usuario } from "./Usuario";
import { Pelicula } from "./Pelicula";
import { Serie } from "./Serie";

@Entity()
export class Biblioteca extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Usuario, usuario => usuario.biblioteca, { eager: true })
  @JoinColumn({ name: "id_usuario" })
  usuario!: Usuario;

  @ManyToOne(() => Pelicula, { nullable: true, eager: true })
  @JoinColumn({ name: "id_pelicula" })
  pelicula?: Pelicula;

  @ManyToOne(() => Serie, { nullable: true, eager: true })
  @JoinColumn({ name: "id_serie" })
  serie?: Serie;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  fecha_compra!: Date;
}
