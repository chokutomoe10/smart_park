import { Request, Response } from "express";
import TicketUserService from "../services/TicketUserService";

class TicketUserController {
  find(req: Request, res: Response) {
    TicketUserService.find(req, res);
  }
  create(req: Request, res: Response) {
    TicketUserService.create(req, res);
  }
}

export default new TicketUserController();
