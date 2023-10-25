import { Request, Response } from "express";
import { Floor } from "../entities/Floor";
import { AppDataSource } from "../data-source";
import { Repository } from "typeorm";

class FloorUserService {
  private readonly floorRepository: Repository<Floor> =
    AppDataSource.getRepository(Floor);

  async find(req: Request, res: Response) {
    try {
      // const id = req.params.id;

      const floor = await this.floorRepository.find({
        // where: {
        //   mall: {
        //     // id: id,
        //   },
        // },
        select: [
          "id",
          "parkingCode",
          "isBooked",
          "created_at",
          "updated_at",
          "mall",
        ],
      });

      if (!floor) {
        return res.status(404).json({ message: "Floor not found" });
      }

      return res.status(200).json(floor);
    } catch (error) {
      console.error(error); // Log the error for debugging purposes
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async update(req: Request, res: Response) {
    const id = req.params.id;
    const floor = await this.floorRepository.findOne({
      where: { id: id },
    });

    if (floor.isBooked) {
      floor.isBooked = false;
    }

    this.floorRepository.save(floor);
    return res.status(200).json(floor);
  }
}

export default new FloorUserService();
