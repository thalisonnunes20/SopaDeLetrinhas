# Caça-Palavras

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Sem dependências](https://img.shields.io/badge/depend%C3%AAncias-nenhuma-4f6b4a?style=for-the-badge)
![Licença MIT](https://img.shields.io/badge/licen%C3%A7a-MIT-a8472b?style=for-the-badge)

Um jogo de caça-palavras clássico, leve e direto no navegador. Abriu, já tem quebra-cabeça pronto: sem login, sem cadastro, sem anúncios.

O projeto foi desenvolvido com foco na simplicidade e facilidade de uso, oferecendo um passatempo direto ao ponto, livre de menus confusos ou poluição visual. O visual lembra uma revista de passatempo: fundo cor de papel, letras grandes e marca-texto colorido nas palavras encontradas.

## O que é o jogo

Em cada partida o jogo sorteia palavras de um tema, esconde todas dentro de uma grade de letras e mostra ao lado uma lista com as palavras e uma **dica** para cada uma. O objetivo é encontrar todas.

Cada vez que você clica em **Novo jogo**, as palavras e a grade são sorteadas de novo, então dificilmente duas partidas são iguais.

## Características

- **Pronto para jogar:** abre e já tem um quebra-cabeça, sem login.
- **Dicas por palavra:** a lista mostra uma pista e o número de letras de cada palavra.
- **6 temas + Surpresa:** animais, frutas, países, corpo humano, cozinha e natureza, ou uma mistura de todos. São mais de 290 palavras.
- **4 dificuldades:** muda o tamanho da grade e a quantidade de palavras.
- **2 modos de jogo:** muda a direção em que as palavras aparecem.
- **Funciona em desktop e celular:** controles por mouse ou toque.
- **Progresso salvo no aparelho:** se fechar a página, continua de onde parou.
- **Leve e seguro:** sem bibliotecas, sem servidor e sem enviar nada para a internet.

## Como jogar

1. Escolha o **tema**, a **dificuldade** e o **modo** (ou jogue direto com o que já veio).
2. Procure na grade as palavras da lista. Use as dicas se travar.
3. Para marcar uma palavra, de um dos dois jeitos:
   - **Arrastar:** pressione na primeira letra e arraste até a última.
   - **Tocar duas vezes:** toque na primeira letra e depois na última.
4. A palavra certa fica marcada com cor e riscada na lista. Palavra errada apenas "balança" e nada acontece.
5. Ao encontrar todas, aparece a mensagem de parabéns. Clique em **Novo jogo** para recomeçar ou para trocar as palavras a qualquer momento.

### Dificuldades

| Nível | Grade | Palavras | Observação |
|---|---|---|---|
| Fácil | 8×8 | 6 | palavras curtas |
| Médio | 10×10 | 8 | |
| Difícil | 12×12 | 10 | |
| Experiente | 15×15 | 14 | dá preferência a palavras longas e complexas |

### Modos

| Modo | Como as palavras aparecem |
|---|---|
| Clássico | da esquerda para a direita (→) e de cima para baixo (↓) |
| Maluco | nas 8 direções: horizontal, vertical, diagonais e de trás para frente |

Qualquer dificuldade pode ser combinada com qualquer modo.

## Como rodar

Não precisa instalar nada, não tem etapa de build e não depende de internet.

### Opção 1: abrir direto no navegador

1. Baixe ou clone o projeto:
   ```bash
   git clone https://github.com/thalisonnunes20/SopaDeLetrinhas.git
   ```
2. Abra o arquivo `index.html` com dois cliques (Chrome, Edge, Firefox, Safari etc.).

### Opção 2: servidor local (opcional)

Se preferir abrir por `http://localhost`, use qualquer servidor de arquivos estáticos. Dentro da pasta do projeto:

```bash
# com Python
python -m http.server 8080

# ou com Node.js
npx serve .
```

Depois acesse `http://localhost:8080`.

### Opção 3: publicar na internet

Como o jogo é só HTML, CSS e JavaScript, qualquer hospedagem de arquivos estáticos serve: GitHub Pages, Cloudflare Pages, Netlify ou um nginx. Basta publicar a pasta do projeto.

## Personalizar

Tudo é editável sem programar muito:

- **Palavras e dicas:** edite `js/words.js`. Cada tema é uma lista de pares `['PALAVRA', 'dica']`, e a palavra pode ter acento ou hífen, porque eles são removidos automaticamente na grade.
- **Novo tema:** copie um bloco de tema em `js/words.js` e troque o nome e as palavras. Ele aparece sozinho na lista de temas.
- **Tamanho e quantidade de palavras:** ajuste `LEVELS` em `js/puzzle.js`.
- **Direções das palavras:** ajuste `MODES` em `js/puzzle.js`.
- **Cores e fontes:** edite as variáveis no começo de `css/style.css`.

## Segurança e privacidade

- Não tem backend, banco de dados, login nem formulários.
- O jogo não faz nenhuma requisição de rede e não usa bibliotecas externas ou CDNs.
- Uma Política de Segurança de Conteúdo (CSP) no `index.html` impede o carregamento de qualquer coisa de fora do projeto.
- O progresso fica salvo apenas no `localStorage` do seu navegador e é validado ao carregar, caso tenha sido alterado.

## Estrutura do projeto

```text
SopaDeLetrinhas/
├── index.html        # página e política de segurança (CSP)
├── css/
│   └── style.css     # visual
├── js/
│   ├── words.js      # temas, palavras e dicas
│   ├── puzzle.js     # gerador da grade, dificuldades e modos
│   └── app.js        # jogo, seleção de palavras e salvamento local
├── LICENSE
└── README.md
```

## Licença

Distribuído sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
