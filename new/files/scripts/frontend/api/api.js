const fs = require('fs')
const path = require('path')
let apiCalls = fs.readFileSync(path.resolve(__dirname, './templates/api.js'), 'utf8')

let resource = process.argv[2];

if (!resource) {
   console.error('No resource name provided.')
   console.error('Example: npm run api <resource>')
   console.error('This will create a file in src/api/ with several http methods that can be easily imported anywhere.')
   process.exit()
}

resource = resource.toLowerCase()

if (fs.existsSync(`./src/api/${resource}Data.js`)) {
    console.error(`File ${resource}Data.js already exists in src/api/`)
    process.exit()
} 

let capitalResourceName = resource.charAt(0).toUpperCase() + resource.slice(1)
apiCalls = apiCalls.replace(/Name/g, `${capitalResourceName}`)
apiCalls = apiCalls.replace(/name/g, `${resource}`)

try {
    fs.writeFileSync(`./src/api/${resource}Data.js`, apiCalls)
    console.log("Created axios requests:")
    console.log("")
    console.log(`GET:    api/v1/${resource}`);
    console.log(`PUT:    api/v1/${resource}/:id`);
    console.log(`DELETE: api/v1/${resource}/:id `);
    console.log(`POST:   api/v1/${resource} `);
} catch (err) {
    console.error('Couldn\'t create file. Error: ', err)
}