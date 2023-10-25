import { Repository } from "typeorm";
import { User } from "../../entities/User";
import { AppDataSource } from "../../data-source";
import { Request, Response } from "express";
import { Ticket } from "../../entities/tiket";

class ReportService {
  private readonly officerRepository: Repository<User> =
    AppDataSource.getRepository(User);

  private readonly ticketRepository: Repository<Ticket> =
    AppDataSource.getRepository(Ticket);

  async getReportAllOfficers(req: Request, res: Response) {
    const roleId = res.locals.loginSession.user.role;
    if (roleId != "3") {
      return res.status(400).json({ error: "Role required" });
    }
    try {
      const officers = await this.officerRepository.find({
        order: {
          id: "ASC",
        },
        select: ["id", "fullname", "username", "created_at", "address"],
      });
      return res.status(200).json(officers);
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: error });
    }
  }

  async getReportBookDays(req: Request, res: Response) {
    const roleId = res.locals.loginSession.user.role;
    if (roleId != "3") {
      return res.status(400).json({ error: "Role required" });
    }
    try {
      const officers = await this.ticketRepository.find({
        select: ["id", "noKendaraan", "user", "floor", "created_at"],
      });
      const inputDate = req.query.day;
      const filteredOfficers = officers.filter(
        (officer) => formatDate(officer.created_at) === inputDate
      );
      return res.status(200).json(filteredOfficers);
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: error });
    }
  }

  async getReportBookMonth(req: Request, res: Response) {
    const roleId = res.locals.loginSession.user.role;
    if (roleId != "3") {
      return res.status(400).json({ error: "Role required" });
    }
    try {
      const officers = await this.ticketRepository.find({
        select: ["id", "noKendaraan", "user", "floor", "created_at"],
      });
      const inputMonth = req.query.month;
      const filteredOfficers = officers.filter(
        (officer) => formatYearMonth(officer.created_at) === inputMonth
      );
      return res.status(200).json(filteredOfficers);
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: error });
    }
  }

  async getReportBookYear(req: Request, res: Response) {
    try {
      const officers = await this.ticketRepository.find({
        select: ["id", "noKendaraan", "user", "floor", "created_at"],
      });
      const inputYear = req.query.year;
      const filteredOfficers = officers.filter(
        (officer) => formatYear(officer.created_at) === inputYear
      );
      return res.status(200).json(filteredOfficers);
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

function formatYearMonth(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function formatYear(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  return `${year}`;
}
export default new ReportService();
