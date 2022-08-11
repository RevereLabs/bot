import { CourierClient } from "@trycourier/courier";

const courier = CourierClient({ authorizationToken: "pk_test_G21K56A1ZVMG8FGFCM2BBSTNYY8C" }); // get from the Courier UI

// Example: send a basic message to an email recipient
const { requestId } = await courier.send({
  message: {
    to: {
      data: {
        name: "Lol",
      },
      email: "gameboi1608@gmail.com",
    },
    content: {
      title: "Back to the Future",
      body: "Oh my {{name}}, we need 1.21 Gigawatts!",
    },
    routing: {
      method: "single",
      channels: ["email"],
    },
  },
});