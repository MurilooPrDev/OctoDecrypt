const fs = require('fs');
const zlib = require('zlib');

/**
 * MOTOR OCTODECRYPT - Mascote: Alberto 🐙👓
 */
const albertoEngine = (data) => {
    let buffer = Buffer.isBuffer(data) ? data : Buffer.from(data);
    
    // 1. Pula bytes nulos iniciais (Caça o 1º byte)
    let start = 0;
    while (start < buffer.length && buffer[start] === 0) start++;
    let slice = buffer.slice(start);

    // 2. Detector de ELF
    if (slice.indexOf(Buffer.from([0x7f, 0x45, 0x4c, 0x46])) !== -1) {
        return "🐙 Alberto: ENCONTRADO CABEÇALHO ELF! (Código Descriptografado)";
    }

    // 3. Analisa se o conteúdo é Binário ou Texto
    // Se tiver muitos bytes fora da tabela ASCII, o Alberto trata como Hex
    const isBinary = slice.slice(0, 100).some(b => b < 9 || (b > 13 && b < 32 && b !== 27));

    if (isBinary) {
        let hexDump = "🐙 Alberto - MODO HEXADECIMAL (Binário Detectado):\n";
        hexDump += "Offset    00 01 02 03 04 05 06 07  08 09 0A 0B 0C 0D 0E 0F\n";
        hexDump += "----------------------------------------------------------\n";
        
        for (let i = 0; i < Math.min(slice.length, 512); i += 16) {
            let line = slice.slice(i, i + 16);
            let addr = i.toString(16).padStart(8, '0');
            let hex = line.toString('hex').match(/.{1,2}/g).join(' ');
            hexDump += `${addr}  ${hex.padEnd(47, ' ')}\n`;
        }
        return hexDump + (slice.length > 512 ? "\n... (dados omitidos para poupar memória)" : "");
    }

    // 4. Se for Texto/Base64, tenta descascar
    let text = slice.toString('utf8').trim();
    if (text.length > 4 && /^[A-Za-z0-9+/=]+$/.test(text.split('\n')[0])) {
        try {
            return albertoEngine(Buffer.from(text, 'base64'));
        } catch (e) { return text; }
    }

    return text;
};

if (process.argv[2]) {
    const target = process.argv[2];
    if (fs.existsSync(target)) {
        console.log(albertoEngine(fs.readFileSync(target)));
    } else {
        console.log("Arquivo não encontrado.");
    }
}
