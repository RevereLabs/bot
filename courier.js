import { CourierClient } from "@trycourier/courier";
import * as dotenv from 'dotenv';
dotenv.config();
const courier = CourierClient({ authorizationToken: process.env.COURIERJS });

const { requestId } = await courier.send({
  message: {
    to: {
      data: {
        name: "Naman",
      },
      email: "gameboi1608@gmail.com",
    },
    content: {
      title: "Welcome to RevereLabs!",
      body: "Congratulations {{name}}!,\n Your account has been created with Revere Labs!",
    },
    routing: {
      method: "single",
      channels: ["email"],
    },
  },
});