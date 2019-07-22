const { logError } = require("@blixi/core")
const { readFileSync } = require('fs')
const { join, resolve } = require('path')
const { sync } = require('glob')
const chalk = require('chalk')

messageChecks = {
    note: {
      regex:    /(?:^|[^:])(\/\/|\{\{\!|\!|\{\#|\*)(\-\-)?\s*@?NOTE\b\s*(?:\(([^:]*)\))*\s*:?\s*(.*)/i,
      label:    ' ✐ NOTE',
      colorer:  chalk.green
    },
    optimize: {
      regex:    /(?:^|[^:])(\/\/|\{\{\!|\!|\{\#|\*)(\-\-)?\s*@?OPTIMIZE\b\s*(?:\(([^:]*)\))*\s*:?\s*(.*)/i,
      label:    ' ↻ OPTIMIZE',
      colorer:  chalk.blue
    },
    todo: {
      regex:    /(?:^|[^:])(\/\/|\{\{\!|\!|\{\#|\*)(\-\-)?\s*@?TODO\b\s*(?:\(([^:]*)\))*\s*:?\s*(.*)/i,
      label:    ' TODO',
      colorer:  chalk.magenta
    },
    hack: {
      regex:    /(?:^|[^:])(\/\/|\{\{\!|\!|\{\#|\*)(\-\-)?\s*@?HACK\b\s*(?:\(([^:]*)\))*\s*:?\s*(.*)/i,
      label:    ' ✄ HACK',
      colorer:  chalk.yellow
    },
    xxx: {
      regex:    /(?:^|[^:])(\/\/|\{\{\!|\!|\{\#|\*)(\-\-)?\s*@?XXX\b\s*(?:\(([^:]*)\))*\s*:?\s*(.*)/i,
      label:    ' ✗ XXX',
      colorer:  chalk.black.bgYellow
    },
    fixme: {
      regex:    /(?:^|[^:])(\/\/|\{\{\!|\!|\{\#|\*)(\-\-)?\s*@?FIXME\b\s*(?:\(([^:]*)\))*\s*:?\s*(.*)/i,
      label:    ' ☠ FIXME',
      colorer:  chalk.red
    },
    bug: {
      regex:    /(?:^|[^:])(\/\/|\{\{\!|\!|\{\#|\*)(\-\-)?\s*@?BUG\b\s*(?:\(([^:]*)\))*\s*:?\s*(.*)/i,
      label:    ' ☢ BUG',
      colorer:  chalk.white.bgRed
    }
  };


async function notes() {
    const files = sync('**/*',  { "ignore": ["**/node_modules/**", '**/dist/**', '.map'], "nodir": true })
    files.forEach(file => {
        const data = readFileSync(file, 'utf8')
        const lines = data.split('\n')
        const comments = []
        lines.forEach((line, lineNumber) => {
            Object.keys(messageChecks).forEach(checkName => {
                const messageCheckType = messageChecks[checkName]
                const match = line.match(messageCheckType.regex)
                const message = {
                    author: '',
                    message: '',
                    label: '',
                    colorer: '',
                    line_number: lineNumber + 1
                }
                
                if (match && match[3] && match[3].length) {
                    message.author = match[3].trim()
                }
                if (match && match[4] && match[4].length) {
                    message.label   = messageCheckType.label;
                    message.colorer = messageCheckType.colorer;
                    message.message = match[4].trim()
                    comments.push(message)
                }
            })

        })
        if (comments.length) {
            console.log(formatFilePathOutput(file, comments.length))

            comments.forEach(comment => {
                console.log(formatMessageOutput(comment, lines.length))
            })            
        }
    })
}

function formatFilePathOutput (filePath, numberOfMessages) {
    var filePathOutput = chalk.bold.white('\n\n* ' + filePath + ' '),
        messagesString = 'messages';
  
    if (numberOfMessages === 1) {
      messagesString = 'message';
    }
  
    filePathOutput += chalk.grey('[' + numberOfMessages + ' ' + messagesString + ']:');
  
    return filePathOutput;
  }

module.exports = {
    notes
}

function getPaddedLineNumber (lineNumber, totalLinesNumber) {
    var paddedLineNumberString = '' + lineNumber;
  
    while (paddedLineNumberString.length < ('' + totalLinesNumber).length) {
      paddedLineNumberString = ' ' + paddedLineNumberString;
    }
  
    return paddedLineNumberString;
  }


function formatMessageOutput (individualMessage, totalNumberOfLines) {
    var paddedLineNumber = getPaddedLineNumber(individualMessage.line_number, totalNumberOfLines),
        finalLabelString,
        finalNoteString;
  
    finalNoteString = chalk.gray('  [Line ' + paddedLineNumber + '] ');
  
    finalLabelString = individualMessage.label;
  
    if (individualMessage.author) {
      finalLabelString += (' from ' + individualMessage.author + ': ');
    } else {
      finalLabelString += ' - ';
    }
  
    finalLabelString = chalk.bold(individualMessage.colorer(finalLabelString));
  
    finalNoteString += finalLabelString;
  
    if (individualMessage.message && individualMessage.message.length) {
      finalNoteString += individualMessage.colorer(individualMessage.message);
    } else {
      finalNoteString += chalk.grey('[[no message to display]]');
    }
  
    return finalNoteString;
  }