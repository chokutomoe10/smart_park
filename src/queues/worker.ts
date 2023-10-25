import * as amqp from "amqplib";
import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";
import { AppDataSource } from "../data-source";
// import { Mallang } from "../entities/Mall";
import { Mall } from "../../src/entities/Mall"; // Adjust the path as needed

async function processQueue() {
  const queueName = "es-queue";
  cloudinary.config({
    cloud_name: "dyvyitzad",
    api_key: "388776212935339",
    api_secret: "HBdnfHxyH8NblujT_JPwZNP4Qa8",
  });
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    await channel.assertQueue("queueName");

    // Callback -> (()=> { })
    await channel.consume(queueName, async (message) => {
      if (message !== null) {
        try {
          const payload = JSON.parse(message.content.toString());
          let cloudinaryResponse: any;
          //taruh sini
          if (payload.image) {
            cloudinaryResponse = await cloudinary.uploader.upload(
              "../../uploads/" + payload.image
            );
          }

          // const malles = AppDataSource.getRepository(Mall).create({
          //   name: payload.name,
          //   district: payload.district,
          //   address: payload.address,
          //   image: payload.image,
          // });

          // const malles = MallRes.create({
          //   name: payload.name,
          //   district: payload.district,
          //   address: payload.address,
          //   image: cloudinaryResponse.secure_url,
          // });

          const malles = AppDataSource.getRepository(Mall).create({
            name: payload.name,
            district: payload.district,
            address: payload.address,
            image: cloudinaryResponse.secure_url,
          });
          console.log("payload", payload);
          console.log("image :", cloudinaryResponse.secure_url);
          // console.log("Received Message : ", payload);
          // console.log("masuk siniga 3");
          await AppDataSource.getRepository(Mall).save(malles);

          //kasih tau kalau sudah selesai kirim data
          channel.ack(message);
        } catch (error) {
          console.log("Error hehehe ", error);
        }
      }
    });
  } catch (error) {
    console.log("Error Processing Queue : ", error);
  }
}
// export { processQueue };
AppDataSource.initialize().then(async () => {
  processQueue();
});
