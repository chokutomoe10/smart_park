import * as amqp from "amqplib";
import { Request, Response } from "express";
import { createdMallSchema } from "../utils/validators/mall";
class QueueController {
  async enqueue(req: Request, res: Response) {
    try {
      console.log(req.body.content);
      const queueName = "es-queue";
      console.log("masuk sini gak 1");

      const filename = res.locals.filename;
      const data = {
        name: req.body.name ? req.body.name : "",
        district: req.body.district ? req.body.district : "",
        address: req.body.address ? req.body.address : "",
        image: filename,
      };
      console.log("masuk sini gak 2");
      const { error } = createdMallSchema.validate(data);
      console.log("masuk sini gak 3");
      if (error) {
        return res.status(400).json({ error: error });
      }
      console.log("masuk sini gak 4");
      const payload = {
        name: req.body.name,
        district: req.body.district,
        address: req.body.address,
        image: filename,
      };
      console.log("masuk sini gak 5");
      const connection = await amqp.connect("amqp://localhost");
      console.log("masuk sini gak 6");
      const channel = await connection.createChannel();
      console.log("masuk sini gak 7");
      //create queue
      //assertQueue buat ngecek ada gk data ny di server
      console.log("masuk sini gak 8");
      await channel.assertQueue(queueName);
      console.log("masuk sini gak 9");
      channel.sendToQueue(queueName, Buffer.from(JSON.stringify(payload)));
      console.log("masuk sini gak 10");
      // await channel.close()
      // await connection.close()

      res.status(200).json({
        message: "Mall is Queued",
      });
    } catch (error) {
      console.log("queuing nya error : ", error);
      res.status(200).json({
        message: "Mall is Error / Something wrong",
      });
    }
  }
}

export default new QueueController();
