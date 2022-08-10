/* import moralis */
import Moralis from "moralis-v1/node.js";
import * as dotenv from 'dotenv';
dotenv.config();
/* Moralis init code */
const serverUrl = process.env.SERVERURL;
const appId = process.env.APPID;
const masterKey = process.env.MASTERKEY;

console.log(serverUrl + " " + appId + " " + masterKey);

export const SaveData = async (nameOfDeveloper, languages, links) => {
  await Moralis.start({ serverUrl, appId, masterKey });

  const Developer = Moralis.Object.extend("Developer");
  const newDeveloper = new Developer();

  newDeveloper.set("name", nameOfDeveloper);
  newDeveloper.set("Languages", languages);
  newDeveloper.set("Links", links);

  await newDeveloper.save();
};


try {
  SaveData("Hello", ["JavaScript", "Python"], ["https://docs.moralis.io/moralis-dapp/database/objects"]);
} catch (e) {
  console.log(e);
}