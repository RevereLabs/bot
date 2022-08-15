import * as dotenv from 'dotenv';
dotenv.config();
import { CourierClient } from "@trycourier/courier";
const courier = CourierClient({ authorizationToken: process.env.COURIERJS });
export function sendWelcomeEmail(nameOfDeveloper, emailOfDeveloper) {
    console.log("reached in emails");
    courier.send({
        message: {
            to: {
                data: {
                    name: nameOfDeveloper,
                },
                email: emailOfDeveloper,
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
}


function getListOfDaos(associations) {
    var daos = "";
    for (var i = 0; i < associations.length; i++) {
        daos += associations[i]
        daos += "\n";

    }
    return daos;
}


export function sendRepeatEmail(nameOfDeveloper, emailOfDeveloper, associations) {
    courier.send({
        message: {
            to: {
                data: {
                    name: nameOfDeveloper,
                },
                email: emailOfDeveloper,
            },
            content: {
                title: "Greetings from RevereLabs!",
                body: "Hey {{name}}!,\n Your account had already been created with Revere Labs when you were associated with the following organisation:\n\n"+getListOfDaos(associations),
            },
            routing: {
                method: "single",
                channels: ["email"],
            },
        },
    });
}

