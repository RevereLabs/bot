import * as dotenv from 'dotenv';
dotenv.config();
// TODO: import the clouud functions
import { createUser, createOrUpdateUser, getUser } from '../functions/utils.js';
import { sendWelcomeEmail, sendRepeatEmail } from './courier.js';
import { SaveData, CheckIfExists, CheckIfExistsQ } from './moralis.js';
import { Client, GatewayIntentBits } from 'discord.js';
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

// Getting "numberOfMsgs" messages from the channel "channelID"
async function getMessages(channelID, numberOfMsgs, channelName) {

    const reciever = client.channels.cache.get(channelID);
    const sender = client.channels.cache.get("1008046869030654032");
    if (channelName === 'intro') {
        reciever.messages.fetch({ limit: numberOfMsgs }).then(messages => {
            console.log(`Received ${messages.size} messages`);
            messages.forEach(async (message) => {

                // Parsing JSON
                var recievedData = message.content;
                try {
                
                    var object = JSON.parse(recievedData);
                
                    // Getting attributes
                    const nameOfDeveloper = object.name;
                    const emailOfDeveloper = object.email;
                    const languages = object.Languages;
                    const links = object.Links;
                    const associations = [];
                    associations.push(message.guild.name);
                    // Logging for debugging
                    console.log(message.content);
                    console.log(nameOfDeveloper);
                    console.log(emailOfDeveloper);
                    console.log(languages);
                    console.log(links);

                    
                    // Cloud function calls
                    const preExisting = await getUser(emailOfDeveloper);
                    console.log("reached 1", preExisting.get("email"), emailOfDeveloper);
                    if (preExisting === null) {
                        createUser(emailOfDeveloper, nameOfDeveloper, languages, links, associations);
                        console.log("reached 2");
                    } else {
                        if (nameOfDeveloper === undefined) { 
                            nameOfDeveloper = null;
                        }
                        if (emailOfDeveloper === undefined) { 
                            emailOfDeveloper = null;
                        }
                        if (languages === undefined) { 
                            languages = null;
                        }
                        if (links === undefined) { 
                            links = null;
                        }
                        if (associations.length === 0) { 
                            associations = null;
                        }
                        createOrUpdateUser(emailOfDeveloper, nameOfDeveloper, languages, links, associations);
                    }
                    // const newUser = CheckIfExists(nameOfDeveloper, emailOfDeveloper, languages, links, associations);
                
                
                } catch (err) {
                    console.log(err);
                    message.content = "Invalid JSON";
                    reciever.send(message);
                    return;
                }
               
                message.content = "<@" + message.author.id + ">"+"Please check your email inbox";
                reciever.send(message);
            
            })

        });
    } else if (channelName === 'listings') {


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
                sender.send(message);

            })

        });
        
    }

}


// Getting "numberOfMsgs" messages from the channel "channelID"
function checkIntroQueue(introChannels, numberOfMsgs) {
    for (var i = 0; i < introChannels.length; i++) {
        const reciever = client.channels.cache.get(introChannels[i]);
    
        // const sender = client.channels.cache.get("1008046869030654032");
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
                    const associations = [];
                    associations.push(message.guild.name);
                    // Logging for debugging
                    console.log(message.content);
                    console.log(nameOfDeveloper);
                    console.log(emailOfDeveloper);
                    console.log(languages);
                    console.log(links);
                    
                    const newUser = CheckIfExistsQ(nameOfDeveloper, emailOfDeveloper, languages, links, associations);
                    
                    
                } catch (err) {
                    console.log(err);
                    message.content = "Invalid JSON";
                    
                }    
            })
            
        });
    }
            
    

}


// Function triggered when the bot becomes active
client.on('ready', () => {
    console.log(client.user.tag);
    var introChannels = ["1008046792501366895", "1008046743822286858", "1008046685580181574"];
    // checkIntroQueue(introChannels, 30);
    // var listingChannels = [];
    // checkListingQueue(listingChannels, 30);
});

// Function triggered when bot recieves any message
client.on("messageCreate", async(msg) => {
    if (msg.author.bot) return;

    var channelName = msg.channel.name;

    if (channelName === 'intro' || channelName === 'listings') {
        // Method to fetch 1 message and send to our server/channel
        getMessages(msg.channel.id, 1, channelName);    
    }
    

});

// Starting the bot
client.login(process.env.TOKEN);




