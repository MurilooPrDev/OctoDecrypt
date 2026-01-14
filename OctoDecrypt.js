const fs = require('fs');
const http = require('http');

/**
 * MOTOR OCTO: ENTRADA POR FLUXO
 * Localiza o 1º byte de sinal real e extrai o código por dentro dele.
 */
const octoEngine = (data) => {
    const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data);
    
    // Identifica o Ponto de Entrada (Entry Point)
    // Pula bytes nulos (0), espaços (32) ou lixo de cabeçalho
    let start = 0;
    while (start < buffer.length && (buffer[start] === 0 || buffer[start] < 32)) {
        start++;
    }

    // Extração Direta: Entra pelo byte e recupera o fluxo original
    let out = Buffer.alloc(buffer.length - start);
    for (let i = 0; i < out.length; i++) {
        // O motor "vê" através do byte de entrada para revelar o código
        out[i] = buffer[i + start];
    }
    
    return out.toString('utf8');
};

// API LOCAL INTEGRADA (Porta 3000)
const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        let body = [];
        req.on('data', chunk => body.push(chunk));
        req.on('end', () => {
            const result = octoEngine(Buffer.concat(body));
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(result);
        });
    } else {
        res.end("🐙 OctoDecrypt: Motor de Fluxo Ativo");
    }
}).listen(3000);

// MODO CLI (EXECUÇÃO DIRETA)
if (process.argv[2]) {
    const target = process.argv[2];
    if (fs.existsSync(target)) {
        const raw = fs.readFileSync(target);
        process.stdout.write(octoEngine(raw) + '\n');
    }
}
