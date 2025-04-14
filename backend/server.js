// puxa o .env, importa o express, cors, e path
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// funcoes de servico que fazem chamada das apis
const { getPlaylistByMood } = require('./services/playlistService');
const { getDrinksByMood } = require('./services/drinkService');
const { getSnacksByMood } = require('./services/snackService');

const app = express(); // instancia do express para configurar o servidor 
const PORT = process.env.PORT || 3001;

app.use(cors()); // habilita as requisições cross-origin
app.use(express.json()); // permite que o servidor interprete o body das em json

app.use(express.static(path.join(__dirname, '../frontend'))); // configura o express para servir arquivos estaticos da pasta frontend

app.get('/', (req, res) => { // renderiza o inde.html localizado na pasta frontend
  res.sendFile('index.html', { root: path.join(__dirname, '../frontend') });
});

const getRandomItem = (array) => { //  recebe um array e retorna um item aleatorio
  return array[Math.floor(Math.random() * array.length)];
};

// retorna uma musica (track) aleatoria com base no humor quando acessar "/api/playlist/:mood", a função getPlaylistByMood é chamada
// e depois é selecionado um track aleatorio dentre os resultados (se houver algum) se nao houver, retorna null
app.get('/api/playlist/:mood', async (req, res) => {
  try {
    const { mood } = req.params;  // extrai o humor da url
    const playlist = await getPlaylistByMood(mood); // chama a funcao que busca a playlist
    const randomTrack = playlist.length > 0 ? getRandomItem(playlist) : null;
    res.json({ playlist: randomTrack }); // retorna em json, com a propriedade "playlist" contendo o item selecionado.
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Falha ao obter a playlist" });
  }
});

// retorna um drink aleatorio com base no humor chama getDrinksByMood e seleciona um drink aleatorio
app.get('/api/drinks/:mood', async (req, res) => {
  try {
    const { mood } = req.params; // extrai o humor da url
    const drinks = await getDrinksByMood(mood); // busca os drinks com base no humor
    const randomDrink = drinks.length > 0 ? getRandomItem(drinks) : null; // seleciona aleatoriamente um drink, se houver algum, caso contrário, retorna null
    res.json({ drinks: randomDrink });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Falha ao obter os drinks" });
  }
});

// igual aos outros endpoints, chama a função getSnacksByMood e seleciona aleatoriamente um snack
app.get('/api/snacks/:mood', async (req, res) => {
  try {
    const { mood } = req.params;
    const snacks = await getSnacksByMood(mood);
    const randomSnack = snacks.length > 0 ? getRandomItem(snacks) : null;
    res.json({ snacks: randomSnack });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Falha ao obter os snacks" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
