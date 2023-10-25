import { Repository } from "typeorm";
import { User } from "../entities/User";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import { loginSchema } from "../utils/validators/user";
import * as jwt from "jsonwebtoken";

class AuthService {
  private readonly authRepository: Repository<User> =
    AppDataSource.getRepository(User);

  async register(req: Request, res: Response) {
    try {
      const data = {
        fullname: req.body.fullname,
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
      };

      // Input validation (You should add more validation as needed)
      if (!data.fullname || !data.username || !data.email || !data.password) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const user = this.authRepository.create({
        fullname: data.fullname,
        username: data.username,
        email: data.email,
        phone: data.phone,
        password: hashedPassword,
        role: "1",
      });

      await this.authRepository.save(user); // Wait for user to be saved

      const responseMessage = `Data User Berhasil di buat:\n${JSON.stringify(
        user,
        null,
        2
      )}`;

      console.log("Request body:", user);

      return res.status(200).send(responseMessage);
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: "Terjadi kesalahan pada server" });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const data = req.body;

      const { error, value } = loginSchema.validate(data);
      if (error) {
        return res.status(400).json({ error: error });
      }

      const checkUser = await this.authRepository.findOne({
        where: {
          // email: value.email,
          username: value.username,
        },
        select: [
          "id",
          "fullname",
          "username",
          "email",
          "password",
          "role",
          "phone",
        ],
      });

      if (!checkUser) {
        return res.status(400).json("Error Email / password is wrong");
      }

      const isPasswordValid = bcrypt.compare(
        value.password,
        checkUser.password
      );
      if (!isPasswordValid) {
        return res.status(400).json({
          error: "Email/passwrod is wrong!",
        });
      }
      const user = this.authRepository.create({
        id: checkUser.id,
        fullname: checkUser.fullname,
        username: checkUser.username,
        email: checkUser.email,
        phone: checkUser.phone,
        role: checkUser.role,
      });
      const token = jwt.sign({ user }, "bagiansecret", { expiresIn: "24h" });

      return res.status(200).json({
        user: user,
        token,
      });
    } catch (error) {
      return res.status(500).json("Terjadi kesalahan pada server");
    }
  }

  async check(req: Request, res: Response) {
    try {
      const loginSession = res.locals.loginSession;

      const user = await this.authRepository.findOne({
        where: {
          id: loginSession.user.id,
        },
        select: [

          "id",
          "fullname",
          "username",
          "email",
          "phone",
          "role",
        ],
      });

      return res.status(200).json({
        user,
        message: "Token is valid",
      });
    } catch (error) {
      return res.status(500).json("Terjadi kesalahan pada server");
    }
  }
}
export default new AuthService();
