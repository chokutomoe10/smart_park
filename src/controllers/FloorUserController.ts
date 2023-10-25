import { Request, Response } from "express";
import FloorUserService from "../services/FloorUserService";

class FloorController {
  find(req: Request, res: Response) {
    FloorUserService.find(req, res);
  }
  update(req: Request, res: Response) {
    FloorUserService.update(req, res);
  }
}

export default new FloorController();
