/* import moralis */
const Moralis = require("moralis-v1/node");

/* Moralis init code */
const serverUrl = "YOUR-SERVER-URL";
const appId = "YOUR-APP-ID";
const masterKey = "YOUR-MASTER-KEY";

export const SaveData = async (nameOfDeveloper, languages, links) => {
  await Moralis.start({ serverUrl, appId, masterKey });

  const Developer = Moralis.Object.extend("Developer");
  const newDeveloper = new Developer();

  newDeveloper.set("name", nameOfDeveloper);
  newDeveloper.set("Languages", languages);
  newDeveloper.set("Links", links);

  await newDeveloper.save();
};


