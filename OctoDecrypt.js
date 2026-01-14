const fs = require('fs');
const http = require('http');

/**
 * MOTOR OCTO RECURSIVO
 * Entra pelo 1º byte e se encontrar outra camada (Base64), mergulha nela.
 */
const octoEngine = (data) => {
    let buffer = Buffer.isBuffer(data) ? data : Buffer.from(data);
    
    // 1. Localiza o 1º byte útil (pula nulos e lixo)
    let start = 0;
    while (start < buffer.length && (buffer[start] === 0 || buffer[start] < 32)) {
        start++;
    }

    // Extrai o conteúdo a partir do ponto de entrada
    let extracted = buffer.slice(start).toString('utf8').trim();

    // 2. BYPASS DE CAMADA: Se for Base64, ele decodifica e entra de novo no 1º byte
    if (extracted.length > 4 && /^[A-Za-z0-9+/=]+$/.test(extracted)) {
        try {
            const decoded = Buffer.from(extracted, 'base64');
            // Recursividade: tenta achar o código real dentro do Base64
            return octoEngine(decoded);
        } catch (e) {
            return extracted; 
        }
    }

    return extracted;
};

// API INTEGRADA (Porta 3000)
http.createServer((req, res) => {
    if (req.method === 'POST') {
        let body = [];
        req.on('data', chunk => body.push(chunk));
        req.on('end', () => {
            const result = octoEngine(Buffer.concat(body));
            res.end(result);
        });
    } else {
        res.end("🐙 OctoDecrypt Motor Ativo");
    }
}).listen(3000);

// MODO TERMINAL (CLI)
if (process.argv[2]) {
    const target = process.argv[2];
    if (fs.existsSync(target)) {
        const finalResult = octoEngine(fs.readFileSync(target));
        process.stdout.write(finalResult + '\n');
    } else {
        console.log("Arquivo não encontrado.");
    }
}
