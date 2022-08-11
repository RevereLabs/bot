/* import moralis */
import Moralis from "moralis-v1/node.js";
import * as dotenv from 'dotenv';
dotenv.config();
/* Moralis init code */
const serverUrl = process.env.SERVERURL;
const appId = process.env.APPID;
const masterKey = process.env.MASTERKEY;

console.log(serverUrl + " " + appId + " " + masterKey);

export const SaveData = async (nameOfDeveloper, emailOfDeveloper, languages, links) => {
  await Moralis.start({ serverUrl, appId, masterKey });

  const Developer = Moralis.Object.extend("Developer");
  const newDeveloper = new Developer();

  newDeveloper.set("name", nameOfDeveloper);
  newDeveloper.set("email", emailOfDeveloper);
  newDeveloper.set("Languages", languages);
  newDeveloper.set("Links", links);

  await newDeveloper.save();
};
