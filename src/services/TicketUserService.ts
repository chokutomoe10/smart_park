import { Request, Response } from "express";

import { AppDataSource } from "../data-source";
import { Repository } from "typeorm";
import { Floor } from "../entities/Floor";
import { Ticket } from "../entities/tiket";

class TicketUserService {
  private readonly checkinRepository: Repository<Ticket> =
    AppDataSource.getRepository(Ticket);
  private readonly floorRepository: Repository<Floor> =
    AppDataSource.getRepository(Floor);

  async find(req: Request, res: Response) {
    const idUser = res.locals.loginSession.user.id;
    const ticket = await this.checkinRepository.find({
      where: { user: { id: idUser } },
      order: { created_at: "DESC" },
    });

    return res.status(200).json(ticket);
  }

  async create(req: Request, res: Response) {
    try {
      const idFloor = req.params.id;
      const userId = res.locals.loginSession.user.id;
      const data = {
        noKendaraan: req.body.noKendaraan,
      };

      const ticket = this.checkinRepository.create({
        noKendaraan: data.noKendaraan,
        // floor: idFloor,
        user: userId,
      });

      await this.checkinRepository.save(ticket);

      const floor = await this.floorRepository.findOne({
        where: { id: idFloor },
      });

      if (floor) {
        floor.isBooked = true;
        await this.floorRepository.save(floor);
      }
      console.log("masuk sini gak 5");
      return res.status(200).send({ ticket, floor });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
}

export default new TicketUserService();
