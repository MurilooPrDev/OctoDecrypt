class OctoPeeker {
    static async peekInside(buffer) {
        const firstByte = buffer[0];
        console.log(`\n[Octo-Peeker] Localizando fresta no Byte 0 (0x${firstByte.toString(16).toUpperCase()})...`);
        
        let leakage = [];
        // A "Fresta": Analisamos como o primeiro byte se propaga pelo arquivo
        for (let i = 0; i < Math.min(buffer.length, 1024); i++) {
            if (buffer[i] === firstByte) leakage.push(i);
        }
        
        console.log(`[Octo-Peeker] Infiltração concluída. Encontradas ${leakage.length} brechas estruturais.`);
        return { fresta: firstByte, points: leakage };
    }
}
module.exports = OctoPeeker;
