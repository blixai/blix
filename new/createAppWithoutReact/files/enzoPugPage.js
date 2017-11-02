let fs = require('fs')
let path = require('path')

let name = process.argv[2]
name = name.toLowerCase()
let pages = process.argv.splice(3, process.argv.length)
// probably should loop through and remove invalid page names

let pug = fs.readFileSync(path.resolve(__dirname, './templates/pugTemplate.pug'), 'utf8')
pug = pug.replace(/Name/g, name)
let css = `body {\n\tcolor: blue;\n}`
let js = `console.log('hello world')`


let createPages = () => {
  pages.forEach(page => {
    page = page.toLowerCase()
    let pageController = `\n\nexports.${page} = (req, res) => {\n\tres.render('${name}/${page}', {})\n}`
    let pageRoute = `\nr.get('/${name}/${page}', ${name}.${page})`
    fs.writeFile(`./server/views/${name}/${page}.pug`, pug, (err) => {
      if (err) throw err
    })
    fs.appendFile('./server/routes.js', pageRoute, (err) => {
      if (err) throw err
    })
    fs.appendFile(`./server/controllers/${name}.js`, pageController, (err) => {
      if (err) throw err
    })
  })
}

let newPage = () => {
  fs.mkdirSync(`./src/${name}`)
  fs.mkdirSync(`./server/views/${name}`)
  fs.writeFile(`./server/views/${name}/index.pug`, pug, (err) => {
    if (err) throw err
  })
  let index = `exports.index = (req, res) => {\n\tres.render('${name}/index', {})\n}`
  fs.writeFile(`./server/controllers/${name}.js`, index, (err) => {
    if (err) throw err
  })
  let pageRoute = `\n\nconst ${name} = require('./controllers/${name}')\nr.get('/${name}', ${name}.index)`
  fs.appendFile('./server/routes.js', pageRoute, (err) => {
    if (err) throw err
  })
  createPages()
  fs.writeFile(`./src/${name}/main.css`, css, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./src/${name}/index.js`, js, (err) => {
    if (err) throw err
  })
}

if (name) {
  newPage()
}
