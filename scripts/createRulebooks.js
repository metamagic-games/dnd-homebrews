import { handbooker } from "handbooker";

const options = {
  debug: true,
  printOptions: {
    displayHeaderFooter: false,
  },
  markdownOptions: {
    //"baseUrl": null,
    // "breaks": false,
    // "gfm": true,
    // "headerIds": true,
    // "headerPrefix": "",
    // "highlight": null,
    // "langPrefix": "language-",
    // "mangle": true,
    // "pedantic": false,
    // "sanitize": false,
    // "sanitizer": null,
    // "silent": false,
    // "smartLists": false,
    // "smartypants": false,
    // "tokenizer": null,
    // "walkTokens": null,
    // "xhtml": false
  }
};

const homebrewDocuments = [
  "./src/Classes/Warden/Warden",
  "./src/Subclasses/Ranger/Tribune/Tribune",
];

const createRulebooks = async () => {
  console.log("Creating rulebooks...");

  for (let i = 0; i < homebrewDocuments.length; i++) {
    const hbDocument = homebrewDocuments[i];

    console.log("\n>>>", hbDocument);

    await handbooker(`${hbDocument}.md`, `${hbDocument}.pdf`, options);
  }

  console.log("\nFinished!");
};

createRulebooks();
