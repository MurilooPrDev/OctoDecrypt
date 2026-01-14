#!/bin/bash

echo -e "\e[34m[+] Iniciando Instalação do OctoDecrypt...\e[0m"

# 1. Verificar e instalar Node.js se não existir
if ! command -v node &> /dev/null; then
    echo -e "\e[33m[*] Instalando Node.js...\e[0m"
    pkg install nodejs -y
fi

# 2. Instalar dependências do NPM
echo -e "\e[33m[*] Instalando bibliotecas (MBs de recursos)...\e[0m"
npm install axios chalk cli-progress fs-extra crypto-js

# 3. Preparar o executável
echo -e "\e[33m[*] Configurando comando global...\e[0m"
# Adiciona a shebang no topo se não existir
if ! grep -q "#!/usr/bin/env node" Octo-decrypt.js; then
    sed -i '1i #!/usr/bin/env node' Octo-decrypt.js
fi

# Dar permissão de execução
chmod +x Octo-decrypt.js

# Corrigir shebang para o caminho do Termux
termux-fix-shebang Octo-decrypt.js

# Criar o link simbólico para o comando global
ln -sf $(pwd)/Octo-decrypt.js $PREFIX/bin/octodecrypt

echo -e "\e[32m[+] INSTALAÇÃO CONCLUÍDA!\e[0m"
echo -e "\e[36m agora você pode usar o comando: octodecrypt <arquivo>\e[0m"
