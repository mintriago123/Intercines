import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BaseEntity } from "typeorm";
import { Usuario } from "./Usuario";
import { Pelicula } from "./Pelicula";
import { Serie } from "./Serie";

@Entity()
export class Carrito extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  // Relación con Usuario
  @ManyToOne(() => Usuario, usuario => usuario.carrito, { eager: true })
  @JoinColumn({ name: "id_usuario" })
  usuario!: Usuario;

  // Relación con Película (nullable)
  @ManyToOne(() => Pelicula, { nullable: true, eager: true })
  @JoinColumn({ name: "id_pelicula" })
  pelicula?: Pelicula | null;

  // Relación con Serie (nullable)
  @ManyToOne(() => Serie, { nullable: true, eager: true })
  @JoinColumn({ name: "id_serie" })
  serie?: Serie | null;

  @Column("int")
  cantidad!: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;
}
