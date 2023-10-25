import { Repository } from "typeorm";
import { User } from "../../entities/User";
import { AppDataSource } from "../../data-source";
import { Request, Response } from "express";
import { Ticket } from "../../entities/tiket";
import { Floor } from "../../entities/Floor";

class ReportService {
  private readonly officerRepository: Repository<User> =
    AppDataSource.getRepository(User);

  private readonly ticketRepository: Repository<Ticket> =
    AppDataSource.getRepository(Ticket);

  private readonly floorRepository: Repository<Floor> =
    AppDataSource.getRepository(Floor);

  // jumlah petugas
  async getCountOfficer(req: Request, res: Response) {
    try {
      const officers = await this.officerRepository.find({
        order: {
          id: "ASC",
        },
        select: ["id", "fullname", "username", "created_at", "address"],
      });
      const officerCount = officers.length;
      return res.status(200).json(officerCount);
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: error });
    }
  }

  // total booking hari ini , di count berdasrakan ticket hari ini
  async getCountBookToday(req: Request, res: Response) {
    try {
      const tickets = await this.ticketRepository.find({
        select: ["id", "noKendaraan", "user", "floor", "created_at"],
      });

      const inputDate = req.query.day;

      const filteredTickets = tickets.filter(
        (officer) => formatDate(officer.created_at) === inputDate
      );
      const officerCount = filteredTickets.length;
      return res.status(200).json(officerCount);
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: error });
    }
  }

  // jumlah lahan tersedia
  async getCountFloorsAvaible(req: Request, res: Response) {
    try {
      const floors = await this.floorRepository.find({
        order: {
          id: "ASC",
        },
        where: {
          isBooked: false,
        },
        select: ["id", "parkingCode", "mall", "isBooked"],
      });
      const floorsCount = floors.length;
      return res.status(200).json(floorsCount);
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: error });
    }
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default new ReportService();
