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
  './src/Subclasses/Ranger/Tribune/Tribune',
]

// ---------------------------------

const createRulebooks = async _ => {
  console.log('Creating rulebooks...')

  for( let i = 0; i < homebrewDocuments.length; i++) {
    const hbDocument = homebrewDocuments[i]
    
    console.log('\n>>>', hbDocument)
    
    const x = await handbooker(
      `${hbDocument}.md`, 
      `${hbDocument}.pdf`, 
      options
    )
  }

  console.log('\nFinished!')
}

createRulebooks()
