let fs   = require('fs')
let path = require('path')
let log  = console.log
let name = process.argv[2]

if (name !== undefined) {
  name = name.toLowerCase()
} else {
  log('No page name supplied. Try npm run page <name>')
}

let pages = process.argv.splice(3, process.argv.length)


let html = fs.readFileSync(path.resolve(__dirname, './templates/htmlPageTemplate.html'), 'utf8')
html = html.replace(/Name/g, `${name}`)
let css = `body {\n\tcolor: blue;\n}`
let js = `console.log('hello world')`
let route = `\nr.get('/${name}', (req, res) => res.sendFile(path.join(__dirname, '../public/${name}/index.html')))`


let createPages = () => {
  pages.forEach(page => {
    page = page.toLowerCase()
    if (fs.existsSync(`./src/${name}/${page}`)) {
      log(`The folder ${page} already exists`)
    } else {
      let pageRoute = `\nr.get('/${name}/${page}', (req, res) => res.sendFile(path.join(__dirname, '../public/${name}/${page}/index.html')))`
      let subPage = fs.readFileSync(path.resolve(__dirname, './templates/htmlPageTemplate.html'), 'utf8')
      subPage = subPage.replace(/Name/g, `../${page}`)
      fs.mkdirSync(`./src/${name}/${page}`)
      log(`Created ${page} folder in src/${name}/${page}`)
      fs.writeFile(`./src/${name}/${page}/index.html`, subPage, (err) => {
        if (err) throw err
        log(`Created page ${page} src/${name}/${page}`)
      })
      fs.appendFile('./server/routes.js', pageRoute, (err) => {
        if (err) throw err
        log(`Added ${page} route to routes.js`)
      })
      fs.writeFile(`./src/${name}/${page}/index.js`, js, (err) => {
        if (err) throw err
        log(`Created index.js file in src/${name}/${page}`)
      })
      fs.writeFile(`./src/${name}/${page}/main.css`, css, (err) => {
        if (err) throw err
        log(`Created main.css file in src/${name}/${page}`)
      })
    }
  })
}


let newPage = () => {
  if (fs.existsSync(`./src/${name}`)) {
    createPages()
  } else {
    fs.mkdirSync(`./src/${name}`)
    fs.writeFile(`./src/${name}/index.html`, html, (err) => {
      if (err) throw err
    })
    fs.writeFile(`./src/${name}/main.css`, css, (err) => {
      if (err) throw err
    })
    fs.writeFile(`./src/${name}/index.js`, js, (err) => {
      if (err) throw err
    })
    fs.appendFile(`./server/routes.js`, route, (err) => {
      if (err) throw err
    })
    createPages()
  }
}

if (name) {
  newPage()
}
