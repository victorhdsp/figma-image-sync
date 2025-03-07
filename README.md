# Figma Image Sync
 É um projeto destinado a sincronizar imagens entre o figma e uma pasta do google drive.

## Momento
 Até o momento a aplicação consegue sincronizar uma pasta do google drive com uma página do figma, então em teoria isso já é um projeto funcional, estou baixando somente os arquivos modificados, visualizo isso utilizando o "modifiedAt", porém tem alguns pontos que acho necessário acertar para considerar um projeto funcional de fato.

 [ ] Fazer o plugin funcionar em background, sem manter o plugin aberto.
 [ ] Criar um design bonito para as telas.
 [ ] Manter o usuário logado por mais tempo.
 [ ] Converter arquivos em PSD para PNG.

 ## Instalação

 Node: v20.15.1
 NPM: v10.9.0

 Em um terminal basta entrar na pasta "b_end", usar o "npm install" para instalar as dependencias e usar o "npm run dev" para executar o backend.

 Em um segundo terminal, basta entrar na pasta "f_end" e usar o "npm install" em seguida o "npm run dev" para executar o frontend.

 Com ambos ativos, basta entrar no figma e importar o "manifest.json" do frontend na parte de plugins e então executar.
 