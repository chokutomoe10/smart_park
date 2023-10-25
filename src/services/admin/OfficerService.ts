import { Repository } from "typeorm";
import { User } from "../../entities/User";
import { AppDataSource } from "../../data-source";
import { Request, Response } from "express";
import * as bcrypt from "bcrypt";

class OfficerService {
  private readonly officerRepository: Repository<User> =
    AppDataSource.getRepository(User);

  async getAllOfficers(req: Request, res: Response) {
    const roleId = res.locals.loginSession.user.role;
    if (roleId != "3") {
      return res.status(400).json({ error: "Role required" });
    }
    try {
      const officers = await this.officerRepository.find({
        order: {
          id: "DESC",
        },
      });
      return res.status(200).json(officers);
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: error });
    }
  }

  async create(req: Request, res: Response) {
    const roleId = res.locals.loginSession.user.role;
    try {
      if (roleId != "3") {
        return res.status(400).json({ error: "Role required" });
      }
      const data = {
        fullname: req.body.fullname,
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        password: req.body.password,
      };
      if (
        !data.fullname ||
        !data.username ||
        !data.email ||
        !data.password ||
        !data.address ||
        !data.phone
      ) {
        return res.status(400).json({ error: "All fields are required" });
      }
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const user = this.officerRepository.create({
        fullname: data.fullname,
        username: data.username,
        email: data.email,
        phone: data.phone,
        address: data.address,
        password: hashedPassword,
        role: "2",
      });
      await this.officerRepository.save(user);
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

  async delete(req: Request, res: Response) {
    try {
      // const roleId = res.locals.loginSession.user.role;
      // if (roleId != "3") {
      //   return res.status(400).json({ error: "Role required" });
      // }
      const id = req.params.id;
      const deletedOficcer = await this.officerRepository.delete(id);
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
      const officerToUpdate = await this.officerRepository.findOne({
        where: {
          id: id,
        },
      });
      if (!officerToUpdate) {
        return res.status(404).json({ error: "Officer not found" });
      }
      const { fullname, username, email, phone, password } = req.body;
      const updatedUser = new User();
      updatedUser.fullname = fullname;
      updatedUser.username = username;
      updatedUser.email = email;
      updatedUser.phone = phone;
      updatedUser.password = password;
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        officerToUpdate.password = hashedPassword;
      }
      officerToUpdate.fullname = fullname;
      officerToUpdate.username = username;
      officerToUpdate.email = email;
      officerToUpdate.phone = phone;
      officerToUpdate.updated_at = new Date();
      const updatedOfficer = await this.officerRepository.save(officerToUpdate);
      return res.status(200).json(updatedOfficer);
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
export default new OfficerService();
