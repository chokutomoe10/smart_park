import * as express from "express";
import AuthController from "../controllers/AuthController";
import authenticate from "../middlewares/auth";
import OfficerController from "../controllers/Admin/OfficerController";
import MallController from "../controllers/Admin/MallController";
import FloorController from "../controllers/Admin/FloorController";
import ReportController from "../controllers/Admin/ReportController";
import TicketUserController from "../controllers/TicketUserController";
import FloorUserController from "../controllers/FloorUserController";
import { upload } from "../middlewares/upload";
import QueueController from "../controllers/QueueController";

const router = express.Router();

router.get("/officer", authenticate, OfficerController.getAllOfficers);
router.post("/officer", authenticate, OfficerController.create);
router.delete("/officer/:id", authenticate, OfficerController.delete);
router.put("/officer/:id", authenticate, OfficerController.update);

router.get("/mall", authenticate, MallController.getAllMalls);
router.post("/mall", upload("image"), authenticate, QueueController.enqueue);
router.delete("/mall/:id", authenticate, MallController.delete);
router.put("/mall/:id", authenticate, MallController.update);

router.get("/floor", authenticate, FloorController.getAllFloors);
router.post("/floor", authenticate, FloorController.create);
router.delete("/floor/:id", authenticate, FloorController.delete);
router.put("/floor/:id", authenticate, FloorController.update);

router.get("/report/Officers", authenticate, ReportController.ReportOfficers);
router.get("/report/book-day", authenticate, ReportController.ReportBookToday);
router.get(
  "/report/book-month",
  authenticate,
  ReportController.ReportBookMonth
);
router.get("/report/book-year", authenticate, ReportController.ReportBookYear);

router.get("/ticket", authenticate, TicketUserController.find);
router.post("/ticket/:id", authenticate, TicketUserController.create);
router.get("/floors", authenticate, FloorUserController.find);
router.patch("/floor/update/:id", authenticate, FloorUserController.update);
router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);
router.get("/auth/check", authenticate, AuthController.check);

export default router;
