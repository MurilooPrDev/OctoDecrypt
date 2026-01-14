const OctoEngine = require('./src/core/engine');
const chalk = require('chalk');
const file = process.argv[2];
if(!file) { console.log(chalk.red("Uso: node index.js <arquivo>")); process.exit(1); }
console.clear();
console.log(chalk.blue.bold("OCTODECRYPT v1.0.0 - INICIANDO ANALISE FORENSE\n"));
new OctoEngine(file).boot();
