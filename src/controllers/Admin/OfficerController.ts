import { Request, Response } from "express";
import OfficerService from "../../services/admin/OfficerService";

class OfficerController {
  getAllOfficers(req: Request, res: Response) {
    OfficerService.getAllOfficers(req, res);
  }
  create(req: Request, res: Response) {
    OfficerService.create(req, res);
  }
  delete(req: Request, res: Response) {
    OfficerService.delete(req, res);
  }
  update(req: Request, res: Response) {
    OfficerService.update(req, res);
  }
}

export default new OfficerController();
