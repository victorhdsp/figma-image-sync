# Figma Image Sync
 É um projeto destinado a sincronizar imagens entre o figma e uma pasta do google drive.

## Momento
 Até o momento a aplicação consegue sincronizar uma pasta do google drive com uma página do figma, então em teoria isso já é um projeto funcional, estou baixando somente os arquivos modificados, visualizo isso utilizando o "modifiedAt", porém tem alguns pontos que acho necessário acertar para considerar um projeto funcional de fato.

 Por exemplo o plugin só funciona assim que você abre ele e não é o objetivo quero que ele fique ativo o tempo todo e tambem em background, para não ter uma tela atrapalhando o usuário.

 Outro exemplo é o tempo que o plugin permanece conectado no google drive, ele tem uma duração muito curta, não funcionando para manter logado 1 dia inteiro por exemplo.

 ## Instalação

 Node: v20.15.1
 NPM: v10.9.0

 Em um terminal basta entrar na pasta "b_end", usar o "npm install" para instalar as dependencias e usar o "npm run dev" para executar o backend.

 Em um segundo terminal, basta entrar na pasta "f_end" e usar o "npm install" em seguida o "npm run dev" para executar o frontend.

 Com ambos ativos, basta entrar no figma e importar o "manifest.json" do frontend na parte de plugins e então executar.
 