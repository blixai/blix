let fs = require('fs')
let path = require('path')
let log = console.log

let name = process.argv[2]
if (name) {
  name = name.toLowerCase()
} else {
  console.log('No name provided. Try: npm run page <pageName> <subpage>')
  process.exit()
}
let pages = process.argv.splice(3, process.argv.length)
// probably should loop through and remove invalid page names

let pug = fs.readFileSync(path.resolve(__dirname, './templates/pugTemplate.pug'), 'utf8')
pug = pug.replace(/Name/g, name)
let css = `body {\n\tcolor: blue;\n}`
let js = `import './main.css'\nconsole.log('hello world')`

let createPages = () => {
  pages.forEach(page => {
    page = page.toLowerCase()
    if (fs.existsSync(`./src/${name}/${page}`)) {
      log(`The folder ${page} already exists`)
    } else {
      let pageController = `\n\nexports.${page} = (req, res) => {\n\tres.render('${name}/${page}', {})\n}`
      let pageRoute = `\nr.get('/${name}/${page}', ${name}.${page})`
      // take a look at this write file

      let subPage = fs.readFileSync(path.resolve(__dirname, './templates/pugTemplate.pug'), 'utf8')
      subPage = subPage.replace(/Name/g, `../${page}`)
      fs.writeFile(`./server/views/${name}/${page}.pug`, subPage, (err) => {
        if (err) throw err
        log(`Created page ${page} in server/views/${page}`)
      })
      fs.appendFile('./server/routes.js', pageRoute, (err) => {
        if (err) throw err
        log(`Added ${page} route to routes.js`)
      })
      fs.appendFile(`./server/controllers/${name}.js`, pageController, (err) => {
        if (err) throw err
        log(`Added ${page} to ${name} controller`)
      })
      fs.mkdirSync(`./src/${name}/${page}`)
      log(`Created ${page} folder in src/${name}/${page}`)
      fs.writeFile(`./src/${name}/${page}/index.js`, js, (err) => {
        if (err) throw err
        log(`Created index.js file in src/${name}/${page}`)
      })
      fs.writeFile(`./src/${name}/${page}/main.css`, css, (err) => {
        if (err) throw err
        log(`Created main.css file in src/${name}/${page}`)
      })
      addEntry(`${page}`, `${name}/${page}`)
    }

  })
}

let newPage = () => {
  if (fs.existsSync(`./src/${name}`)) {
    createPages()
  } else {
    addEntry(name, name)
    fs.mkdirSync(`./src/${name}`)
    fs.mkdirSync(`./server/views/${name}`)
    fs.writeFile(`./server/views/${name}/index.pug`, pug, (err) => {
      if (err) throw err
      log(`Created index.pug file in server/views/${name}/index.pug`)
    })
    let index = `exports.index = (req, res) => {\n\tres.render('${name}/index', {})\n}`
    let pageRoute;

    if (fs.existsSync(`./server/controllers/${name}.js`)) {
      index = '\n\n' + index
      fs.appendFile(`./server/controllers/${name}.js`, index, (err) => {
        if (err) throw err 
      })
      pageRoute = `\n\nr.get('/${name}', ${name}.index)`
    } else {
      fs.writeFile(`./server/controllers/${name}.js`, index, (err) => {
        if (err) throw err
        log(`Created controller ${name} in server/controllers/${name}`)
      })
      pageRoute = `\n\nconst ${name} = require('./controllers/${name}')\nr.get('/${name}', ${name}.index)`
    }

    fs.appendFile('./server/routes.js', pageRoute, (err) => {
      if (err) throw err
      log(`Added ${name} route to server/routes.js`)
    })
    fs.writeFile(`./src/${name}/main.css`, css, (err) => {
      if (err) throw err
      log(`Created ${name} main.css file`)
    })
    fs.writeFile(`./src/${name}/index.js`, js, (err) => {
      if (err) throw err
      log(`Created ${name} index.js file`)
    })
    createPages()
  }
}


let addEntry = (name, path) => {
  let body = fs.readFileSync('./webpack.config.js', 'utf8')
  if (body.includes(`./src/${path}`)) return 
  let search = `entry: {`
  let index = body.indexOf(search)
  let newEntry = `\n\t\t${name}: './src/${path}',`
  let output = [body.slice(0, index + 8), newEntry, body.slice(index + 8)].join('')
  try {
    fs.writeFileSync('./webpack.config.js', output, 'utf8')
    log(`Add entry ${name} to webpack.config.js`)
  } catch (e) {
    log('Unable to create entry path in webpack.config.js')
  }
}


newPage()
