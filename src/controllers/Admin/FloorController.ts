import { Request, Response } from "express";
import FloorService from "../../services/admin/FloorService";

class FloorController {
  getAllFloors(req: Request, res: Response) {
    FloorService.getAllFloors(req, res);
  }
  create(req: Request, res: Response) {
    FloorService.create(req, res);
  }
  delete(req: Request, res: Response) {
    FloorService.delete(req, res);
  }
  update(req: Request, res: Response) {
    FloorService.update(req, res);
  }
}

export default new FloorController();
