const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3001;

// Mapeia humor para sabor
const moodToFlavor = {
  happy: "fruit",
  relax: "lemon",
  focused: "salt",
  romantic: "cream"
};

// Função para buscar playlist da Last.fm
async function getPlaylistByMood(mood) {
  const apiKey = process.env.LASTFM_API_KEY;
  const url = `https://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=${mood}&api_key=${apiKey}&format=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Erro ao acessar a API Last.fm');

    const data = await response.json();
    const tracks = data.tracks?.track?.slice(0, 5) || [];

    return tracks.map(track => ({
      name: track.name,
      artist: track.artist.name,
      url: track.url
    }));
  } catch (err) {
    console.error("Erro na playlist:", err.message);
    throw new Error('Falha ao obter a playlist');
  }
}

// Função para buscar drinks na TheCocktailDB
async function getDrinksByMood(mood) {
  const flavor = moodToFlavor[mood] || 'fruit';
  const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${flavor}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Erro ao acessar a API CocktailDB');

    const data = await response.json();
    const drinks = data.drinks?.slice(0, 3) || [];

    return drinks.map(drink => ({
      name: drink.strDrink,
      image: drink.strDrinkThumb,
      category: drink.strCategory,
      instructions: drink.strInstructions
    }));
  } catch (err) {
    console.error("Erro nos drinks:", err.message);
    throw new Error('Falha ao obter os drinks');
  }
}

app.use(cors());
app.use(express.json());

// Rotas
app.get('/api/playlist/:mood', async (req, res) => {
  const { mood } = req.params;

  if (!moodToFlavor[mood]) {
    return res.status(400).json({ error: "Humor inválido" });
  }

  try {
    const playlist = await getPlaylistByMood(mood);
    res.json({ playlist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/drinks/:mood', async (req, res) => {
  const { mood } = req.params;

  if (!moodToFlavor[mood]) {
    return res.status(400).json({ error: "Humor inválido" });
  }

  try {
    const drinks = await getDrinksByMood(mood);
    res.json({ drinks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota raiz amigável
app.get('/', (req, res) => {
    res.send(`
      <h1>🎧 Bem-vindo à API Sabor & Som!</h1>
      <p>Use as rotas abaixo para acessar os dados:</p>
      <ul>
        <li><strong>Playlist:</strong> <code>/api/playlist/happy</code></li>
        <li><strong>Drinks:</strong> <code>/api/drinks/relax</code></li>
      </ul>
    `);
  });
  
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
