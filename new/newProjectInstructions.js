// need to create a reusable console log of instructions: ie run npm start
// also need to add the instructions to the README (should be easy)
const log = console.log;
const name = process.argv[3];

const newProjectInstructions = () => {
//   process.stdout.write("\033c");
  log("New Project created!");
  log(`To start: cd into ${name}`);
};

module.exports = { newProjectInstructions };
