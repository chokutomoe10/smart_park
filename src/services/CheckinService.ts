import { Repository } from "typeorm";
import { Request, Response } from "express";
import * as bcrypt from "bcrypt";

import { AppDataSource } from "../data-source";
import { Ticket } from "../entities/tiket";

class CheckinService {
  private readonly checkinRepository: Repository<Ticket> =
    AppDataSource.getRepository(Ticket);
  async create(req: Request, res: Response) {
    const roleId = res.locals.loginSession.user.role;
    const userId = res.locals.loginSession.user.id;
    try {
      if (roleId != "3") {
        return res.status(400).json({ error: "Role required" });
      }

      const data = {
        noKendaraan: req.body.noKendaraan,
        floorId: req.body.floorId,
      };

      const user = this.checkinRepository.create({
        noKendaraan: data.noKendaraan,
        floor: data.floorId,
        user: userId,
      });
      await this.checkinRepository.save(user); // Wait for user to be saved

      const responseMessage = `Data User Berhasil di buat:\n${JSON.stringify(
        user,
        null,
        2
      )}`;

      return res.status(200).send(responseMessage);
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: error });
    }
  }
}

export default new CheckinService();
