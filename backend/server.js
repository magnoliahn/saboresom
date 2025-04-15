require('dotenv').config(); // carrega .env

// importa os modulos: express para criar o servidor, cors para requisições de outros domínios e path para manipulação de caminhos de arquivos
const express = require('express');
const cors = require('cors');
const path = require('path');

const { getPlaylistByMood } = require('./services/playlistService'); // funcoes de serviço para busca
const { getDrinksByMood } = require('./services/drinkService');
const { getSnacksByMood } = require('./services/snackService');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors()); // ativa cors e interpreta json nas requisicoes
app.use(express.json());

app.use(express.static(path.join(__dirname, '../frontend'))); // configura o express para servir arquivos estaticos da pasta frontend

app.get('/', (req, res) => { // envia o arquivo index.html para o cliente
  res.sendFile('index.html', { root: path.join(__dirname, '../frontend') });
});

// escolhe aleatoriamente um item de um array
const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

app.get('/api/playlist/:mood', async (req, res) => {
  try {
    const { mood } = req.params; // extrai o humor da URL
    const playlist = await getPlaylistByMood(mood); // busca a playlist relacionada ao humor
    const randomTrack = playlist.length > 0 ? getRandomItem(playlist) : null; // seleciona uma música aleatória
    res.json({ 
      playlist: randomTrack || { // se nao houver uma musica, retorna uma playlist padrao
        name: "Música Relaxante", 
        artist: "Artista Desconhecido", 
        url: "https://www.last.fm/music" 
      } 
    });
  } catch (error) { // se houver erro, retorna uma playlist padrao
    console.error(error);
    res.json({ 
      playlist: { 
        name: "Música Relaxante", 
        artist: "Artista Desconhecido", 
        url: "https://www.last.fm/music" 
      } 
    });
  }
});

app.get('/api/drinks/:mood', async (req, res) => {
  try {
    const { mood } = req.params; // extrai o humor da URL
    const drinks = await getDrinksByMood(mood); // busca os drinks relacionados ao humor
    const randomDrink = drinks.length > 0 ? getRandomItem(drinks) : null; // seleciona um drink aleatório
    res.json({ 
      drinks: randomDrink || { // se nao houver um drink, retorna um padrao
        name: "Água com Limão",
        image: "https://www.thecocktaildb.com/images/media/drink/xvwusr1472668546.jpg",
        category: "Bebida Refrescante",
        instructions: "Adicione fatias de limão à água gelada."
      }
    });
  } catch (error) { // se houver erro retorna um drink padrao
    console.error(error);
    res.json({ 
      drinks: {
        name: "Água com Limão",
        image: "https://www.thecocktaildb.com/images/media/drink/xvwusr1472668546.jpg",
        category: "Bebida Refrescante",
        instructions: "Adicione fatias de limão à água gelada."
      }
    });
  }
});

app.get('/api/snacks/:mood', async (req, res) => {
  try {
    const { mood } = req.params; // extrai o humor da URL
    const snacks = await getSnacksByMood(mood); // busca os snacks relacionados ao humor
    const randomSnack = snacks.length > 0 ? getRandomItem(snacks) : null; // seleciona um snack aleatório
    res.json({ 
      snacks: randomSnack || { // se nao houver um snack, retorna um padrao
        name: "Mix de Frutas",
        image: "https://www.themealdb.com/images/media/meals/wxywrq1468235067.jpg",
        category: "Snack Saudável",
        instructions: "Misture suas frutas favoritas em uma tigela."
      }
    });
  } catch (error) { // se houver erro retorna um snack padrao
    console.error(error);
    res.json({ 
      snacks: {
        name: "Mix de Frutas",
        image: "https://www.themealdb.com/images/media/meals/wxywrq1468235067.jpg",
        category: "Snack Saudável",
        instructions: "Misture suas frutas favoritas em uma tigela."
      }
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
