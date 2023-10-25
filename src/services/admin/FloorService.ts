import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Request, Response } from "express";
import { Floor } from "../../entities/Floor";

class FloorAdminService {
  private readonly floorRepository: Repository<Floor> =
    AppDataSource.getRepository(Floor);

  async getAllFloors(req: Request, res: Response) {
    // const roleId = res.locals.loginSession.user.role;
    // if (roleId != "3") {
    //   return res.status(400).json({ error: "Role required" });
    // }
    try {
      const floors = await this.floorRepository.find({
        order: {
          parkingCode: "ASC",
        },
      });
      return res.status(200).json(floors);
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: error });
    }
  }

  async create(req: Request, res: Response) {
    const roleId = res.locals.loginSession.user.role;
    // const mallId = req.params.id;

    try {
      if (roleId == "3") {
        return res.status(400).json({ error: "Role required" });
      }

      const data = {
        parkingCode: req.body.parkingCode,

        mallId: req.body.mallId,
      };

      if (!data.parkingCode) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const floor = this.floorRepository.create({
        parkingCode: data.parkingCode,
        isBooked: false,
        mall: data.mallId,
      });
      await this.floorRepository.save(floor); // Wait for user to be saved

      const responseMessage = `Data User Berhasil di buat:\n${JSON.stringify(
        floor,
        null,
        2
      )}`;

      return res.status(200).send(responseMessage);
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: error });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      // const roleId = res.locals.loginSession.user.role;
      // if (roleId != "3") {
      //   return res.status(400).json({ error: "Role required" });
      // }
      const id = req.params.id;
      const deletedOficcer = await this.floorRepository.delete(id);
      return res.status(200).json(deletedOficcer);
    } catch (error) {
      return res.status(500).json("Terjadi kesalahan pada server");
    }
  }

  async update(req: Request, res: Response) {
    try {
      // const roleId = res.locals.loginSession.user.role;
      // if (roleId !== "3") {
      //   return res.status(403).json({ error: "Permission denied" });
      // }

      const id = req.params.id;

      const floorToUpdate = await this.floorRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!floorToUpdate) {
        return res.status(404).json({ error: "Floor not found" });
      }

      const { parkingCode, isBooked } = req.body;

      const updatedFloor = new Floor();
      updatedFloor.parkingCode = parkingCode;
      updatedFloor.isBooked = isBooked;

      floorToUpdate.parkingCode = parkingCode;
      floorToUpdate.isBooked = isBooked;
      floorToUpdate.updated_at = new Date();
      const update = await this.floorRepository.save(floorToUpdate);
      return res.status(200).json(update);
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
export default new FloorAdminService();
