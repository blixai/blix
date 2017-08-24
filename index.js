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

// files that dont change
let gitignore = 'node_modules\n.DS_Store'
let readme = '## bootstrapped with enzo'
let routes = `const express = require('express')\nconst r = express.Router()\nmodule.exports = r`
let babel = `{\n\t"presets": [\n\t\t"es2015",\n\t\t"react"\n\t]\n}`

// backend files 
let server = `let express = require('express')\nlet app = express()\nlet bodyParser = require('body-parser')\nconst routes = require('./routes')\nlet port = (process.env.PORT || 3000)\napp.use(bodyParser.json())\n\napp.use('/api/v1', routes)\napp.listen(port, () => {\n\tconsole.log('Listening at port 3000')\n})`
let pck = `{\n\t"name": "${name}",\n\t"version": "1.0.0",\n\t"scripts": {\n\t\t"start": "nodemon server/server.js"\n\t},\n\t"dependencies": {\n\t\t"body-parser": "^1.17.2",\n\t\t"express": "^4.15.3",\n\t\t"nodemon": "^1.11.0"\n\t}\n}`

// postgres/knex package.json
let pgpck = `{\n\t"name": "${name}",\n\t"version": "1.0.0",\n\t"scripts": {\n\t\t"start": "nodemon server/server.js",\n\t\t"new-endpoints": "pg-endpoints"\n\t},\n\t"dependencies": {\n\t\t"pg-endpoints": "^1.0.2",\n\t\t"body-parser": "^1.17.2",\n\t\t"express": "^4.15.3",\n\t\t"nodemon": "^1.11.0",\n\t\t"knex": "^0.13.0",\n\t\t"pg": "^7.1.2"\n\t}\n}`

// backend serving standard frontend
let frontendServer = `let express = require('express')\nlet app = express()\nlet bodyParser = require('body-parser')\nconst routes = require('./routes')\nconst pages = require('./pages')\nlet port = (process.env.PORT || 3000)\napp.use(bodyParser.json())\n\napp.use('/api/v1', routes)\napp.listen(port, () => {\n\tconsole.log('Listening at port 3000')\n})`

// spa 
let spaServer = `let express = require('express')\nlet app = express()\nlet path = require('path')\nlet bodyParser = require('body-parser')\nconst routes = require('./routes')\nlet port = (process.env.PORT || 3000)\napp.use(bodyParser.json())\n\napp.use('/api/v1', routes)\n\napp.use("/build", express.static(path.join(__dirname, "../build")))\n\napp.get('/', (req, res) => res.sendFile(path.join(__dirname, '../public/index.html')))\n\napp.listen(port, () => {\n\tconsole.log('Listening at port 3000')\n})`
let spaWebpack = `const path = require('path')\n\nmodule.exports = {\n\tentry: './src/index.js',\n\toutput: {\n\t\tfilename: 'bundle.js',\n\t\tpath: path.resolve(__dirname, 'build')\n\t},\n\tmodule: {\n\t\tloaders: [\n\t\t\t{\n\t\t\t\ttest: /\.js$/,\n\t\t\t\tloaders: "babel-loader",\n\t\t\t\texclude: /node_modules/\n\t\t\t},\n\t\t\t{\n\t\t\t\ttest: /\.jsx$/,\n\t\t\t\tloaders: "babel-loader",\n\t\t\t\texclude: /node_modules/\n\t\t\t},\n\t\t\t{\n\t\t\t\ttest: /\.css$/,\n\t\t\t\tloaders: "style-loader!css-loader"\n\t\t\t}\n\t\t]\n\t},\n\tresolve: {\n\t\textensions: ['.js', '.jsx', '.css']\n\t}\n}`
let spaIndex = `import React from 'react'\nimport ReactDOM from 'react-dom'\nimport App from './App/App'\n\nReactDOM.render(\n\t<App/>,\n\tdocument.getElementById('root')\n)`
let spaReact = `import React, { Component } from 'react' \n \nclass App extends Component {\n\tconstructor(props) {\n\t\tsuper(props) \n \t\tthis.state = {}\n\t } \n\n\trender() {\n\t\treturn(\n\t\t\t < div ></div >\n\t\t) \n\t } \n } \n\n export default App`
let spaNoSQLPck = `{\n\t"name": "${name}",\n\t"version": "1.0.0",\n\t"scripts": {\n\t\t"start": "nodemon server/server.js",\n\t\t"build": "webpack --watch"\n\t}\n}`
let spaHtmlFile = `<!DOCTYPE html>\n<html>\n\t<head>\n\t\t<meta charset="utf-8">\n\t\t<meta name="viewport" content="width=device-width, initial-scale=1">\n\t\t<title>Home</title>\n\t</head>\n\t<body>\n\t\t<div id="root"></div>\n\t\t<script src="build/bundle.js"></script>\n\t</body>\n</htlm>`
let spaNoBE = `{\n\t"name": "${name}",\n\t"version": "1.0.0",\n\t"scripts": {\n\t\t"start": "open index.html && webpack --watch"\n\t}\n}`


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


// need to modify the json packages to include webpack, react, react-dom, etc
let createReactSPA = () => {
  rl.question('Do you need a backend? (Y/N) ', (backend) => {
    backend = backend.toLowerCase()
    if (backend === 'y') {
      rl.question('Would you like to configure a postgres database with knex.js? (Y/N) ', (answer) => {
        answer = answer.toLowerCase()
        if (answer === 'y') {
          writeFilesWithSPAReact()
          fs.writeFile(`./${name}/package.json`, spaNoSQLPck, (err) => {
            if (err) throw err
            rl.close();
            shell.cd(`${name}`)
            console.log('Downloading dependencies and setting up the project, this may take a moment')
            shell.exec('npm install --save express nodemon pg knex body-parser react react-dom webpack babel-loader css-loader babel-core babel-preset-es2015 babel-preset-react')
            shell.exec('npm install -g knex')
            shell.exec('knex init')
            modifyKnex()
            process.stdout.write('\033c')
            console.log('The project was created!')
            console.log(`cd into ${name} and run npm start`)
          })
        } else {
          writeFilesWithSPAReact()
          fs.writeFile(`./${name}/package.json`, spaNoSQLPck, (err) => {
            if (err) throw err
            rl.close();
            shell.cd(`${name}`)
            console.log('Downloading dependencies and setting up the project, this may take a moment')
            shell.exec('npm install --save express nodemon body-parser react react-dom webpack babel-loader css-loader babel-core babel-preset-es2015 babel-preset-react')
            process.stdout.write('\033c')
            console.log('The project was created!')
            console.log(`cd into ${name} and run npm start`)
          })
        }

      })
    } else {
      reactSPAWithoutBackend()
    }
  })
}

let reactSPAWithoutBackend = () => {
  fs.mkdirSync(`./${name}/src`)
  fs.mkdirSync(`./${name}/build`)
  fs.writeFile(`./${name}/index.html`, spaHtmlFile, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/webpack.config.js`, spaWebpack, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/src/index.js`, spaIndex, (err) => {
    if (err) throw err
  })
  fs.mkdirSync(`./${name}/src/App`)
  fs.writeFile(`./${name}/src/App/App.js`, spaReact, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/.gitignore`, gitignore, (err) => {
    if (err) throw err
  })

  fs.writeFile(`./${name}/README.md`, readme, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/.babelrc`, babel, (err) => {
    if (err) throw err
  })
  fs.writeFileSync(`./${name}/package.json`, spaNoBE)
  rl.close();
  console.log('Installing dependencies and running setup, this may take a moment')
  shell.cd(`${name}`)
  shell.exec('npm install --save react react-dom webpack babel-loader css-loader babel-core babel-preset-es2015 babel-preset-react')
}


let writeFilesWithSPAReact = () => {
  //frontend
  fs.mkdirSync(`./${name}/src`)
  fs.mkdirSync(`./${name}/build`)
  fs.mkdirSync(`./${name}/public`)
  fs.writeFile(`./${name}/public/index.html`, spaHtmlFile, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/webpack.config.js`, spaWebpack, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/src/index.js`, spaIndex, (err) => {
    if (err) throw err
  })
  fs.mkdirSync(`./${name}/src/App`)
  fs.writeFile(`./${name}/src/App/App.js`, spaReact, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/.babelrc`, babel, (err) => {
    if (err) throw err
  })
  //backend
  fs.mkdirSync(`./${name}/server`)
  fs.mkdirSync(`./${name}/server/models`)
  fs.writeFile(`./${name}/server/server.js`, spaServer, (err) => {
    if (err) throw err
  })

  fs.writeFile(`./${name}/server/routes.js`, routes, (err) => {
    if (err) throw err
  })

  //other files
  fs.writeFile(`./${name}/.gitignore`, gitignore, (err) => {
    if (err) throw err
  })

  fs.writeFile(`./${name}/README.md`, readme, (err) => {
    if (err) throw err
  })
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

  fs.writeFile(`./${name}/server/pages.js`, routes, (err) => {
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
  console.log('Installing dependencies and running setup, this may take a moment')
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