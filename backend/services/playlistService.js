require('dotenv').config(); // carrega .env

async function getPlaylistByMood(mood) {
  try {
    const apiKey = process.env.LASTFM_API_KEY; // puxa a chave da api do last.fm
    if (!apiKey) throw new Error('LASTFM_API_KEY não configurada');
    
    // constroi a url do last.fm com 'tag.gettoptracks' onde a tag e o humor
    const url = `https://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=${mood}&api_key=${apiKey}&format=json`;
    const response = await fetch(url); // faz uma req em http para a url usando fetch e aguarda a resposta
    if (!response.ok) throw new Error(`Erro na API Last.fm (status ${response.status})`);
    const data = await response.json(); // converte a res para json e armazena em data
    const tracks = data.tracks?.track?.slice(0, 5) || []; // verifica se  data.tracks e data.tracks.track existem, caso exista pega os primeiros 5 se não, retorna um array vazio.
    
    //  mapeia cada track para um objeto que contem so oq precisamos 
    return tracks.map(track => ({
      name: track.name,                
      artist: track.artist.name,       
      url: track.url                   
    }));
  } catch (err) {
    console.error("Erro na playlist:", err.message);
    throw err;
  }
}

// exporta as funcoes para que possam ser usadas em outros modulos
module.exports = {
  getPlaylistByMood,
};
