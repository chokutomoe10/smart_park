import { Request, Response } from "express";
import MallService from "../../services/admin/MallService";

class MallController {
  getAllMalls(req: Request, res: Response) {
    MallService.getAllOMalls(req, res);
  }
  create(req: Request, res: Response) {
    MallService.create(req, res);
  }
  delete(req: Request, res: Response) {
    MallService.delete(req, res);
  }
  update(req: Request, res: Response) {
    MallService.update(req, res);
  }
}

export default new MallController();
