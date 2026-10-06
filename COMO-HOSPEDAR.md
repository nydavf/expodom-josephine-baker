# Como usar e hospedar a apresentação (versão web)

Pacote estático: não tem servidor, banco de dados nem build. É só HTML/CSS/JS + fontes + imagens.

## O que tem aqui

| Arquivo/pasta | O que é |
|---|---|
| `index.html` | a apresentação inteira (10 slides) |
| `css/` | estilo |
| `js/` | navegação (setas, teclado, dots) |
| `fonts/` | Playfair Display + Lato (funciona offline) |
| `images/` | fotos e cartazes |
| `COMO-HOSPEDAR.md` | este arquivo |

## Rodar localmente (sem internet)

1. Descompacte a pasta em qualquer lugar.
2. Dê dois cliques em `index.html` — abre no navegador.
3. Navegação: **→ / ←**, **Espaço**, **Home/End**, ou clique nos pontos embaixo.

> Se o navegador bloquear algo por ser arquivo local, use um servidor local:
> `npx serve .` ou, no Chrome, `chrome://flags` → *Allow access to file URLs*.
> (Para apresentar em aula, abrir direto costuma bastar.)

## Publicar de graça (escolha um)

**Netlify Drop (mais rápido)**
1. Acesse <https://app.netlify.com/drop>
2. Arraste a pasta da apresentação para a área indicada.
3. Em segundos você recebe um link público (ex.: `nome-aleatorio.netlify.app`).
4. Em *Site settings → Change site name* dá para colocar um nome bonito.

**GitHub Pages**
1. Crie um repositório e envie os arquivos (`git init`, `git add .`, `git commit -m "site"`, `git push`).
2. No GitHub: *Settings → Pages → Branch: main → Save*.
3. O link fica em `https://SEU-USUARIO.github.io/REPOSITORIO/`.

**Vercel**
1. `npm i -g vercel` e depois `vercel` na pasta (ou arraste no <https://vercel.com/new>).
2. O CLI pede login (conta GitHub/Google) e publica automaticamente.

## Dicas

- Qualquer alteração em `index.html`/`css/` basta subir os arquivos de novo (é estático).
- Se for hospedar em servidor próprio (Apache/Nginx), só copie a pasta para a raiz do site.
- Peso aproximado: ~26 MB (as fotos são em alta resolução de propósito).
