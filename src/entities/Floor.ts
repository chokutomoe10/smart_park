import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { Mall } from "./Mall";
import { Ticket } from "./tiket";

@Entity({ name: "floors" })
export class Floor {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  parkingCode: string;

  @Column({ default: false })
  isBooked: Boolean;

  @ManyToOne(() => Mall, (mall) => mall.floors)
  mall: Mall;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;

  @OneToMany(() => Ticket, (tickets) => tickets.floor)
  tickets: Ticket[];
}
