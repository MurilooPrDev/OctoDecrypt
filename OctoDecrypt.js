const http = require('http');
const fs = require('fs');
const path = require('path');

// MOTOR DE BIT (O BYPASS REAL DO OCTODECRYPT)
const engine = (data, key) => {
    const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data);
    const kBuf = Buffer.from(key);
    let start = 0;
    
    // Pula o lixo (bits nulos) até o payload real
    while (start < buffer.length && buffer[start] === 0) start++;

    let out = Buffer.alloc(buffer.length - start);
    for (let i = 0; i < out.length; i++) {
        // Descriptografia de fluxo direto bit-a-bit
        out[i] = buffer[i + start] ^ kBuf[i % kBuf.length];
    }
    return out;
};

// API INTEGRADA AO REPOSITÓRIO
const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { file, key } = JSON.parse(body);
                const filePath = path.join(__dirname, file);
                if (fs.existsSync(filePath)) {
                    const decrypted = engine(fs.readFileSync(filePath), key);
                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.end(decrypted.toString('utf8'));
                } else {
                    res.writeHead(404); res.end("Arquivo não encontrado.");
                }
            } catch (e) { res.writeHead(500); res.end("Erro no Motor."); }
        });
    } else {
        res.end("🐙 OctoDecrypt API Ativa");
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT);

// MODO CLI (EXECUÇÃO DIRETA VIA TERMINAL)
if (process.argv[2]) {
    const file = process.argv[2];
    const key = process.argv[3];
    if(fs.existsSync(file)) {
        process.stdout.write(engine(fs.readFileSync(file), key).toString('utf8') + '\n');
    } else {
        console.log("Arquivo não encontrado.");
    }
}
