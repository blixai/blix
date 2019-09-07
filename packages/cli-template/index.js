var fs = require('fs')
  , path = require('path')
const { render } = require('mustache')
const { prompt } = require('inquirer')

const { loadTemplate } = require('@blixi/core')

async function template() {
    // TODO prompt for type of template (by lang? framework? FE/BE?)
    console.log("TEMPLATE")
    let questions = []
    let file;
    try {
        file = loadTemplate('js/example.js')
        let reg = /{{(.*?)}}/g;
        let match = reg.exec(file)
        while (match) {
            let text = match[1].trim()
            if (text.charAt(0) === '#') {
                text = text.slice(1)
                let tmpQuestion = {
                    name: text,
                    type: 'confirm',
                    message: text
                }
                questions.push(tmpQuestion)
            } else if (text.charAt(0) !== '/' && text.charAt(0) !== '!' && text.charAt(0) !== '^') {
                let tmpQuestion = {
                    name: text,
                    message: text,
                    type: 'input'
                }
                questions.push(tmpQuestion)
            }

            match = reg.exec(file);
        }

    } catch(err) {
        console.error('Error', err)
    }
    
    let answers = await prompt(questions)
    console.log(answers)
    let renderedFile = render(file, answers)

    console.log(renderedFile)
}

module.exports = {
    template
}