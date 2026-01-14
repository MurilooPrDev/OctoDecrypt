const OctoDumper = require('../modules/dumper');
const OctoBypass = require('../modules/bypass');
const OctoHelpers = require('../utils/helpers');
const OctoClient = require('../api/client');
const chalk = require('chalk');

class OctoEngine {
    constructor(file) { 
        this.file = file; 
        this.id = "OCTO-" + Math.random().toString(36).toUpperCase().slice(2,10); 
    }
    async boot() {
        try {
            const snap = await OctoDumper.createAtomicSnapshot(this.file);
            await OctoBypass.simulateSystemCall(snap.data);
            
            console.log(chalk.cyan("\n[PREVIEW DA ESTRUTURA BRUTA]"));
            console.log(OctoHelpers.hexDump(snap.data));
            
            // Aqui a mágica da fresta acontece dentro do client
            await OctoClient.sendPayload(snap.data, this.id);
            
            console.log(chalk.green.bold(`\n[+] SESSÃO FINALIZADA: ${this.id}`));
            console.log(chalk.white(`[+] ARQUIVO PROCESSADO COM SUCESSO.`));
        } catch (err) {
            console.log(chalk.red("\n[!] ERRO NO MOTOR: " + err.message));
        }
    }
}
module.exports = OctoEngine;
