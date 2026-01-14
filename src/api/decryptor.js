const OctoPeeker = require('./peeker');
class OctoDecryptor {
    static async runUniversal(buffer) {
        const insight = await OctoPeeker.peekInside(buffer);
        console.log("[API-Universal] Reconstruindo dados através da fresta...");
        
        // Técnica de Reversão por Fresta: Deslocamento baseado no byte inicial
        let reconstructed = Buffer.alloc(buffer.length);
        for (let i = 0; i < buffer.length; i++) {
            reconstructed[i] = buffer[i] ^ insight.fresta;
        }
        return reconstructed;
    }
}
module.exports = OctoDecryptor;
