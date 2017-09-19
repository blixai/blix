let fs = require('fs')
let path = require('path')

let name = process.argv[2]

let html = `<!DOCTYPE html>\n<html lang="en">\n\t<head>\n\t\t<title>${name}</title>\n\t\t<meta charset="UTF-8">\n\t\t<meta name="viewport" content="width=device-width, initial-scale=1">\n\t\t<link href="${name}/main.css" rel="stylesheet">\n\t</head>\n\t<body>Hello World ${name}\n<script src='${name}/bundle.js' async></script>\n\t</body>\n</html>`
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