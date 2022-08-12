import * as dotenv from 'dotenv';
dotenv.config();
import { CourierClient } from "@trycourier/courier";

import { SaveData, CheckIfExists } from './moralis.js';
import { Client, GatewayIntentBits } from 'discord.js';
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
const courier = CourierClient({ authorizationToken: process.env.COURIERJS });

// Getting "numberOfMsgs" messages from the channel "channelID"
function getMessages(channelID, numberOfMsgs, channelName) {

    const reciever = client.channels.cache.get(channelID);
    const sender = client.channels.cache.get("1005800383337218091");
    if (channelName === 'intro') {
        reciever.messages.fetch({ limit: numberOfMsgs }).then(messages => {
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
                    // const newUser = CheckIfExists("naman20088@iiitd.ac.in");

                    // if (newUser) {
                    //     SaveData(nameOfDeveloper, emailOfDeveloper, languages, links);
                    //     sendEmail(nameOfDeveloper, emailOfDeveloper);
                    // } else {
                    //     console.log("User already exists");
                    // }
                
                
                } catch (err) {
                    console.log(err);
                    message.content = "Invalid JSON";
                    reciever.send(message);
                }
                sender.send(message);
            
            })

        });
    } else if (channelName === 'listing') {


        reciever.messages.fetch({ limit: numberOfMsgs }).then(messages => {
 
            console.log(`Received ${messages.size} messages`);
            messages.forEach(message => {

                // Parsing JSON
                var recievedData = message.content;
                try {
                
                    var object = JSON.parse(recievedData);
                
                    // Getting attributes
                    const title = object.title;
                    const description = object.description;
                    const stipend = object.stipend;
                    const time = object.time;

                    // Logging for debugging
                    console.log(message.content);
                    console.log(title);
                    console.log(description);
                    console.log(stipend);
                    console.log(time);
                
                } catch (err) {
                    console.log(err);
                    message.content = "Invalid JSON";
                    reciever.send(message);
                }
            
            })

        });
        
    }

}

// Function triggered when the bot becomes active
client.on('ready', () => {
    console.log(client.user.tag);
});



// Function triggered when bot recieves any message
client.on("messageCreate", async(msg) => {
    if (msg.author.bot) return;

    var channelName = msg.channel.name;
    console.log(channelName);
    if (channelName === 'intro' || channelName === 'listing') {
        // Method to fetch 1 message and send to our server/channel
        getMessages(msg.channel.id, 1, channelName);    
    }
    

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




