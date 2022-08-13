
import Moralis from "moralis-v1/node.js";
import * as dotenv from 'dotenv';
dotenv.config();
import { sendWelcomeEmail, sendRepeatEmail } from './courier.js';
/* Moralis init code */
const serverUrl = process.env.SERVERURL;
const appId = process.env.APPID;
const masterKey = process.env.MASTERKEY;

console.log(serverUrl + " " + appId + " " + masterKey);

export const SaveData = async (nameOfDeveloper, emailOfDeveloper, languages, links, association) => {
  await Moralis.start({ serverUrl, appId, masterKey });

  const Developer = Moralis.Object.extend("Developer");
  const newDeveloper = new Developer();

  newDeveloper.set("name", nameOfDeveloper);
  newDeveloper.set("email", emailOfDeveloper);
  newDeveloper.set("Languages", languages);
  newDeveloper.set("Links", links);
  newDeveloper.set("associations", association);
  await newDeveloper.save();
};

// TODO: Apply this function

export const CheckIfExists = async (nameOfDeveloper, emailOfDeveloper, languages, links, association) => {
  await Moralis.start({ serverUrl, appId, masterKey });
  const Developer = Moralis.Object.extend("Developer");
  const query = new Moralis.Query(Developer);
  query.equalTo("email", emailOfDeveloper);
  const results = await query.find();
  console.log("Retrieved " + results.length + " IDs.");
  console.log(results.length == 0);
  if (results.length == 0) {
    SaveData(nameOfDeveloper, emailOfDeveloper, languages, links, association);
    sendWelcomeEmail(nameOfDeveloper, emailOfDeveloper);
  } else {
    console.log("User already exists");
    var dev = results[0];
    var associations = dev.get("associations");
    console.log(associations);
    sendRepeatEmail(nameOfDeveloper, emailOfDeveloper, associations);
  }
};
  

