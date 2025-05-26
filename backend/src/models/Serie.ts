import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Serie {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  titulo!: string;

  @Column("float")
  precio!: number;

  @Column()
  sinopsis!: string;

  @Column("float")
  duracion!: number;

  @Column("numeric")
  temporadas!: number;

  @Column("numeric")
  episodios!: number;

  @Column("float")
  tamano!: number;

  @Column("float")
  valoracion!: number;

  @Column()
  categoria!: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;
}
