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

const paths = {
  warden: "./src/Classes/Warden/Warden",
  tribune: "./src/Subclasses/Ranger/Tribune/Tribune",
}

const documents = [
  paths['warden'],
  paths['tribune'],
];

const createRulebooks = async () => {
  console.log("Creating rulebooks...");

  const cvs = process.argv.slice(2);

  if (cvs.length > 0) {
    for (let i = 0; i < cvs.length; i++) {
      const hbDocument = paths[cvs[i]];

      console.log("\n>>>", hbDocument);

      await handbooker(`${hbDocument}.md`, `${hbDocument}.pdf`, options);
    }
  } else {
    for (let i = 0; i < documents.length; i++) {
      const hbDocument = documents[i];

      console.log("\n>>>", hbDocument);

      await handbooker(`${hbDocument}.md`, `${hbDocument}.pdf`, options);
    }
  }

  console.log("\nFinished!");
};

createRulebooks();