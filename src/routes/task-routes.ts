import { NextFunction, Request, Response, Router } from "express";
import { protect, authorize } from "../middleware/auth";
import { Task } from "../models/task.model";
import { asyncHandler } from "../middleware/async";
import { IReq } from "../interfaces/req.interface";

const router: Router = Router();

/**
 * GET /api/Task
 */
router.get(
  "/user-tasks",
  protect,
  asyncHandler(async (req: Request | any, res: Response) => {
    const tasks = await Task.paginate({ createdBy: req.user._id }, {});
    res.status(200).json({
      tasks: tasks,
    });
  })
);

/**
 * POST /api/Tasks
 */
router.post(
  "/user-tasks",
  protect,
  asyncHandler(async (req: IReq, res: Response, next: NextFunction) => {
    const { title } = req.body;
    let task = await Task.findOne({
      title: title,
      createdBy: req.user._id.toString(),
    });
    if (task) {
      return res
        .status(400)
        .json({ message: "task with this title already exists!" });
    }
    if (!title) {
      return res.status(400).json({ message: "title is required field" });
    }

    task = await Task.create({
      title,
      createdBy: req?.user._id,
    });

    res.status(201).json({ task });
  })
);

router.get(
  "/list-tasks",
  protect,
  authorize,
  asyncHandler(async (req: Request | any, res: Response) => {
    const tasks = await Task.paginate({}, { populate: "createdBy email" });
    res.status(200).json({
      tasks: tasks,
    });
  })
);

export const TasksRoutes: Router = router;
