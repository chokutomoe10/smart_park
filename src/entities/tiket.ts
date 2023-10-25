import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Timestamp,
  OneToOne,
  JoinColumn,
  ManyToOne, // Import JoinColumn
} from "typeorm";
import { User } from "./User";
import { Floor } from "./Floor";

@Entity({ name: "tickets" })
export class Ticket {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  noKendaraan: string;

  @ManyToOne(() => User, (user) => user.tickets)
  user: User;

  @ManyToOne(() => Floor, (floor) => floor.tickets)
  floor: Floor;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;
}
