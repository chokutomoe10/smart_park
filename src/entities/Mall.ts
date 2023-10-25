import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Floor } from "./Floor";

@Entity({ name: "malls" })
export class Mall {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  district: string;

  @Column()
  address: string;

  @Column()
  image: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;

  @OneToMany(() => Floor, (floors) => floors.mall)
  floors: Floor[];
}
