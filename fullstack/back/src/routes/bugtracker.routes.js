import { Router } from "express";
import { methods  as bugTracker} from "./../controller/bugtracker.controller";

const router = Router();

router.get("/", bugTracker.getBugTracker);
router.get("/:id", bugTracker.getBug);
router.delete("/:id", bugTracker.deleteBug);
router.post("/", bugTracker.addBug);
router.put("/:id", bugTracker.updateBug);

export default router;