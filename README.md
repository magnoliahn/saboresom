# Sabor & Som

## 🚀 Funcionalidades

- **Playlist Musical:** Sugestão de uma música com base no seu humor.
- **Drinks:** Receba o nome, imagem e a receita de um drink popular.
- **Snacks:** Sugestão de uma sobremesa ou lanche para complementar sua experiência.

## 🛠️ Tecnologias Utilizadas

- **Front-end:** HTML, CSS, JavaScript  
- **Back-end:** Node.js com Express  
- **APIs:**  
  - [TheCocktailDB](https://www.thecocktaildb.com) - Para obter receitas de drinks  
  - [TheMealDB](https://www.themealdb.com) - Para sugestões de snacks e sobremesas  
  - [Last.fm](https://www.last.fm) - Para recomendações de músicas  
- **Controle de Versão:** Git  

## 📥 Instalação

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/magnoliahn/saboresom.git
   cd saboresom
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**

   Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

   ```env
   PORT=3001  
   LASTFM_API_KEY=SUA_CHAVE_LASTFM_AQUI
   ```

4. **Inicie o servidor:**

   ```bash
   npm start
   ```

5. **Acesse o projeto:**

   Abra o navegador e acesse: [http://localhost:3001](http://localhost:3001)

---
