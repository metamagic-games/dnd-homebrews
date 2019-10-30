const { handbooker, } = require( "handbooker" );

// ---------------------------------

const options = {
	debug: true,
	printOptions: {
		displayHeaderFooter: false,
	},
};

const homebrewDocuments = [
  './src/Classes/Warden/Warden',
]

// ---------------------------------

homebrewDocuments.map(
  homebrewDocument => handbooker(`${homebrewDocument}.md`, `${homebrewDocument}.pdf`, options)
)
