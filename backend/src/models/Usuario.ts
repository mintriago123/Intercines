import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { Serie } from "./Serie";
import { Biblioteca } from "./Biblioteca";
import { Pelicula } from "./Pelicula";
import { Carrito } from "./Carrito";

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column()
  email!: string;

  @Column()
  nombre_usuario!: string;

  @Column()
  password!: string;

  @CreateDateColumn()
  created_at!: Date;

  @Column({ default: false })
  is_admin!: boolean;

  @OneToMany(() => Biblioteca, biblioteca => biblioteca.id_usuario)
  biblioteca!: Biblioteca[];

  @OneToMany(() => Carrito, carrito => carrito.id_usuario)
  carrito!: Carrito[];
}
