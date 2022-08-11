import * as dotenv from 'dotenv';
dotenv.config();
import { CourierClient } from "@trycourier/courier";

import { SaveData } from './moralis.js';
import { Client, GatewayIntentBits } from 'discord.js';
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
const courier = CourierClient({ authorizationToken: process.env.COURIERJS });

// Getting "numberOfMsgs" messages from the channel "channelID"
function getMessages(channelID, numberOfMsgs) {

    const reciever = client.channels.cache.get(channelID);
    const sender = client.channels.cache.get("1005800383337218091");
    reciever.messages.fetch({ limit: numberOfMsgs }).then(messages => {
        // console.log(process.env.TOKEN);
        console.log(`Received ${messages.size} messages`);
        messages.forEach(message => {

            // Parsing JSON
            var recievedData = message.content;
            try {
                
                var object = JSON.parse(recievedData);
                
                // Getting attributes
                const nameOfDeveloper = object.name;
                const emailOfDeveloper = object.email;
                const languages = object.Languages;
                const links = object.Links;

                // Logging for debugging
                console.log(message.content);
                console.log(nameOfDeveloper);
                console.log(emailOfDeveloper);
                console.log(languages);
                console.log(links);
                message.content = `Hi, my name is ${nameOfDeveloper} and I am a developer.\nI know ${languages.length} languages namely ${languages.join(', ')}.\nHere are my links: ${links.join('\n')}`;
                // TODO: Handle multiple same entries case and if bot gets inactive
                SaveData(nameOfDeveloper, emailOfDeveloper, languages, links);
                sendEmail(nameOfDeveloper, emailOfDeveloper);
                
            }catch(err) {
                console.log(err);
            }
            sender.send(message);
            
        })

    });

}

// Function triggered when the bot becomes active
client.on('ready', () => {
    console.log(client.user.tag);
});



// Function triggered when bot recieves any message
client.on("messageCreate", async(msg) => {
    if (msg.author.bot) return;

    // Method to fetch 1 message and send to our server/channel
    getMessages(msg.channel.id, 1);

});



function sendEmail(nameOfDeveloper, emailOfDeveloper) {
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

// Starting the bot
client.login(process.env.TOKEN);




