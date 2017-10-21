let fs = require('fs')
let path = require('path')

let name = process.argv[2]

let html = fs.readFileSync(path.resolve(__dirname, './templates/htmlPageTemplate.html'), 'utf8')
html = html.replace(/Name/g, `${name}`)
let css = `body {\n\tcolor: 'blue'\n}`
let js = `console.log('hello world')`
let route = `\nr.get('/${name}', (req, res) => res.sendFile(path.join(__dirname, '../public/${name}/index.html')))`

let newPage = () => {
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
  fs.appendFile(`./server/pages.js`, route, (err) => {
    if (err) throw err
  })
}

newPage()