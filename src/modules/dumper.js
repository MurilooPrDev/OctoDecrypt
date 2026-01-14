const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

class OctoDumper {
    constructor() { this.chunkSize = 1024 * 64; }
    async createAtomicSnapshot(filePath) {
        return new Promise((resolve, reject) => {
            if (!fs.existsSync(filePath)) return reject(new Error("Arquivo não encontrado"));
            const stats = fs.statSync(filePath);
            const chunks = [];
            const hash = crypto.createHash('sha256');
            const stream = fs.createReadStream(filePath);
            stream.on('data', (chunk) => { hash.update(chunk); chunks.push(chunk); });
            stream.on('end', () => {
                resolve({ data: Buffer.concat(chunks), size: stats.size, hash: hash.digest('hex'), name: path.basename(filePath) });
            });
            stream.on('error', reject);
        });
    }
    getMemoryMapping() {
        try { return fs.readFileSync('/proc/self/maps', 'utf8').split('\n').slice(0, 5).join('\n'); }
        catch (e) { return "Acesso restrito."; }
    }
}
module.exports = new OctoDumper();
