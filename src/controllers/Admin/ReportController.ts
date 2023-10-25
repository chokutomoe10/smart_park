import { Request, Response } from "express";
import ReportService from "../../services/admin/ReportService";

class ReportController {
  ReportOfficers(req: Request, res: Response) {
    ReportService.getReportAllOfficers(req, res);
  }
  ReportBookToday(req: Request, res: Response) {
    ReportService.getReportBookDays(req, res);
  }
  ReportBookMonth(req: Request, res: Response) {
    ReportService.getReportBookMonth(req, res);
  }
  ReportBookYear(req: Request, res: Response) {
    ReportService.getReportBookYear(req, res);
  }
}

export default new ReportController();
