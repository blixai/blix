#!/usr/bin/env node

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let fs = require('fs')
let path = require('path')
let shell = require('shelljs')


let command = process.argv[2]
let name = process.argv[3]

let server = `let express = require('express')\nlet app = express()\nlet bodyParser = require('body-parser')\nconst routes = require('./routes')\nlet port = (process.env.PORT || 3000)\napp.use(bodyParser.json())\n\napp.use('/api/v1', routes)\napp.listen(port, () => {\n\tconsole.log('Listening at port 3000')\n})`
let routes = `const express = require('express')\nconst r = express.Router()\nmodule.exports = r`
let pck = `{\n\t"name": "${name}",\n\t"scripts": {\n\t\t"start": "nodemon server/server.js"\n\t},\n\t"dependencies": {\n\t\t"body-parser": "^1.17.2",\n\t\t"express": "^4.15.3",\n\t\t"nodemon": "^1.11.0"\n\t}\n}`
let pgpck = `{\n\t"name": "${name}",\n\t"scripts": {\n\t\t"start": "nodemon server/server.js",\n\t\t"new-endpoints": "pg-endpoints"\n\t},\n\t"dependencies": {\n\t\t"pg-endpoints": "^1.0.2",\n\t\t"body-parser": "^1.17.2",\n\t\t"express": "^4.15.3",\n\t\t"nodemon": "^1.11.0",\n\t\t"knex": "^0.13.0",\n\t\t"pg": "^7.1.2"\n\t}\n}`
let gitignore = 'node_modules\n.DS_Store'
let readme = '## bootstrapped with enzo'

// backend serving standard frontend
let pageRoutes = `const express = require('express')\nconst r = express.Router()\nmodule.exports = r`
let frontendServer = `let express = require('express')\nlet app = express()\nlet bodyParser = require('body-parser')\nconst routes = require('./routes')\nconst pages = require('./pages')\nlet port = (process.env.PORT || 3000)\napp.use(bodyParser.json())\n\napp.use('/api/v1', routes)\napp.listen(port, () => {\n\tconsole.log('Listening at port 3000')\n})`



let createProject = () => {
  if (name) {
    fs.mkdirSync(`./${name}`)
    
    rl.question('Do you need a client side? (Y/N) ', (answer) => {
      answer = answer.toLowerCase()
      if (answer === 'y') {
        rl.question('Will you be using React? (Y/N) ', (react) => {
          react = react.toLowerCase()
          if (react === 'y') {
            rl.question('Is this a Singe Page Application? (Y/N) ', (spa) => {
              spa = spa.toLowerCase()
              if (spa === 'y') {
               createReactSPA() 
              } else {
                createReactRedux()
              }
            })
          } else {
            createBackendWithFrontend()
          }
        })
      } else {
        createBackend()
      }
    })
  } else {
    rl.close()
  }
}



let createReactSPA = () => {

}

let createReactRedux = () => {
  rl.question('Do you need a backend? (Y/N) ', (backend) => {
    backend = backend.toLowerCase()
    if (backend === 'y') {
      rl.question('Would you like to configure a postgres database with knex.js? (Y/N) ', (answer) => {
        answer = answer.toLowerCase()
        if (answer === 'y') {
          writeFilesWithoutReact()
          fs.writeFile(`./${name}/package.json`, pgpck, (err) => {
            if (err) throw err
            rl.close();
            runPGInstall()
          })
        } else {
          writeFilesWithoutReact()
          fs.writeFile(`./${name}/package.json`, pck, (err) => {
            if (err) throw err
            rl.close();
            runInstall()
          })
        }
    
      })
    } else {
      // create a gitignore and readme
      fs.writeFile(`./${name}/.gitignore`, gitignore, (err) => {
        if (err) throw err
      })

      fs.writeFile(`./${name}/README.md`, readme, (err) => {
        if (err) throw err
      })
    }
  })
}

let createBackendWithFrontend = () => {
  rl.question('Would you like to configure a postgres database with knex.js? (Y/N) ', (answer) => {
    answer = answer.toLowerCase()
    if (answer === 'y') {
      writeFilesWithoutReact()
      fs.writeFile(`./${name}/package.json`, pgpck, (err) => {
        if (err) throw err
        rl.close();
        runPGInstall()
      })
    } else {
      writeFilesWithoutReact()
      fs.writeFile(`./${name}/package.json`, pck, (err) => {
        if (err) throw err
        rl.close();
        runInstall()
      })
    }

  })
}

let createBackend = () => {
  rl.question('Do you need a backend? (Y/N) ', (backend) => {
    backend = backend.toLowerCase()
    if (backend === 'y') {
      rl.question('Would you like to configure a postgres database with knex.js? (Y/N) ', (answer) => {
        answer = answer.toLowerCase()
        if (answer === 'y') {
          writeFiles()
          fs.writeFile(`./${name}/package.json`, pgpck, (err) => {
            if (err) throw err
            rl.close();
            runPGInstall()
          })
        } else {
          writeFiles()
          fs.writeFile(`./${name}/package.json`, pck, (err) => {
            if (err) throw err
            rl.close();
            runInstall()
          })
        }
      })
    } else {
      // create a gitignore and readme
      fs.writeFile(`./${name}/.gitignore`, gitignore, (err) => {
        if (err) throw err
      })

      fs.writeFile(`./${name}/README.md`, readme, (err) => {
        if (err) throw err
      })
    }
  })
}

let checkCommand = (command) => {
  switch (command) {
    case "new":
      createProject()
      break;

    default:
    break;
  }
}

checkCommand(command)

// need to check if project already exists


let writeFiles = () => {
  fs.mkdirSync(`./${name}/server`)
  fs.mkdirSync(`./${name}/server/models`)

  fs.writeFile(`./${name}/server/server.js`, server, (err) => {
    if (err) throw err
  })

  fs.writeFile(`./${name}/server/routes.js`, routes, (err) => {
    if (err) throw err
  })

  fs.writeFile(`./${name}/.gitignore`, gitignore, (err) => {
    if (err) throw err
  })

  fs.writeFile(`./${name}/README.md`, readme, (err) => {
    if (err) throw err
  })
}

let writeFilesWithoutReact = () => {
  fs.mkdirSync(`./${name}/server`)
  fs.mkdirSync(`./${name}/server/models`)
  fs.mkdirSync(`./${name}/server/public`)
  fs.writeFile(`./${name}/server/server.js`, frontendServer, (err) => {
    if (err) throw err
  })

  fs.writeFile(`./${name}/server/routes.js`, routes, (err) => {
    if (err) throw err
  })

  fs.writeFile(`./${name}/server/pages.js`, pageRoutes, (err) => {
    if (err) throw err
  })

  fs.writeFile(`./${name}/.gitignore`, gitignore, (err) => {
    if (err) throw err
  })

  fs.writeFile(`./${name}/README.md`, readme, (err) => {
    if (err) throw err
  })
}


let runInstall = () => {
  console.log('Installing express and other packages, this may take a second')
  shell.cd(`${name}`)
  shell.exec('npm install')
  process.stdout.write('\033c')
  console.log('The server was created!')
  console.log(`cd into ${name} and run npm start`)
}

let runPGInstall = () => {
  console.log('Installing express and other packages, this may take a second')
  shell.cd(`${name}`)
  shell.exec('npm install')
  shell.exec('npm install -g knex')
  shell.exec('knex init')
  modifyKnex()
  process.stdout.write('\033c')
  console.log('The server was created!')
  console.log(`cd into ${name} and run npm start`)
}

let newKnex = `module.exports = {\n\n\tdevelopment: {\n\t\tclient: 'pg',\n\t\tconnection: 'postgres://localhost/${name}',\n\t\tmigrations: {\n\t\t\tdirectory: './db/seeds/dev'\n\t\t},\n\t\tuseNullAsDefault: true\n\t},\n\n\tproduction: {\n\t\tclient: 'pg',\n\t\tconnection: process.env.DATABASE_URL + '?ssl=true',\n\t\tmigrations: {\n\t\t\tdirectory: 'db/migrations'\n\t\t},\n\t\tseeds: {\n\t\t\tdirectory: 'db/seeds/dev'\n\t\t},\n\t\tuseNullAsDefault: true\n\t}\n\n};`

let modifyKnex = () => {
  if (fs.existsSync('./knexfile.js')) {
    fs.truncateSync('./knexfile.js', 0, function () { console.log('done') })
    fs.appendFile('./knexfile.js', newKnex, (err) => {
      if (err) throw err
      shell.exec('knex migrate:make initial')
    })
  }
}

let createPage = () => {

}