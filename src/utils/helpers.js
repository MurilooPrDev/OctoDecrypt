const fs = require('fs');

class OctoHelpers {
    static hexDump(buffer) {
        let out = '';
        for (let i = 0; i < Math.min(buffer.length, 256); i += 16) {
            const chunk = buffer.slice(i, i + 16);
            const hex = chunk.toString('hex').match(/.{1,2}/g).join(' ');
            out += `${i.toString(16).padStart(8, '0')}: ${hex.padEnd(48)} |\n`;
        }
        return out;
    }

    static formatSize(bytes) {
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + ['B', 'KB', 'MB', 'GB'][i];
    }

    static saveLog(sessionID, data, insight) {
        const logContent = `
=== OCTODECRYPT FORENSIC REPORT ===
ID DA SESSAO: ${sessionID}
DATA: ${new Date().toLocaleString()}
FRESTA LOCALIZADA: 0x${insight.fresta.toString(16).toUpperCase()}
PONTOS DE VAZAMENTO: ${insight.points.length}

--- DADOS EXTRAIDOS PELA FRESTA ---
${data.toString('hex').substring(0, 500)}
===================================
`;
        fs.writeFileSync(`report_${sessionID}.txt`, logContent);
        console.log(`\n[+] Log forense salvo em: report_${sessionID}.txt`);
    }
}
module.exports = OctoHelpers;
