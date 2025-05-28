import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, BaseEntity } from "typeorm";
import { Biblioteca } from "./Biblioteca";
import { Carrito } from "./Carrito";

@Entity()
export class Usuario extends BaseEntity {
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

  @OneToMany(() => Biblioteca, biblioteca => biblioteca.usuario)
  biblioteca!: Biblioteca[];

  @OneToMany(() => Carrito, carrito => carrito.usuario)
  carrito!: Carrito[];
}
