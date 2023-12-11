import { Request, Response } from "express";
import Progress from "./progress.model";

class ProgressController {
  async register(req: Request, res: Response) {
    try {
      const watched = await Progress.find({
        userId: req.body.userId,
        lessonId: req.body.lessonId,
      });
      if (watched.length > 0) {
        return;
      }
      const newWatched = new Progress({
        userId: req.body.userId,
        courseId: req.body.courseId,
        lessonId: req.body.lessonId,
      });
      await newWatched
        .save()
        .then((response) => {
          res.status(200).json(response);
        })
        .catch((err) => {
          res.status(500).json({
            error: err,
          });
        });
    } catch (error) {
      console.error("error registering watched video", error);
    }
  }

  async getWatched(req: Request, res: Response) {
    try {
      const userId = req.body.userId;
      const courseId = req.body.courseId;
      const watched = await Progress.find({
        $and: [
          {
            userId,
          },
          {
            courseId,
          },
        ],
      });
      if (watched.length > 0) {
        return res.status(200).json(watched);
      } else {
        return res.status(404).json({
          message: "no watched video found",
        });
      }
    } catch (error) {
      console.error("error fetching certificate", error);
    }
  }
}

export default ProgressController;
