async function buscarSugestoes() {
    const mood = document.getElementById("moodSelect").value;
    const resultado = document.getElementById("resultado");
  
    resultado.innerHTML = "<p>Carregando sugestões...</p>";
  
    try {
      const playlistRes = await fetch(`http://localhost:3001/api/playlist/${mood}`);
      const drinksRes = await fetch(`http://localhost:3001/api/drinks/${mood}`);
  
      if (!playlistRes.ok || !drinksRes.ok) {
        throw new Error("Erro nas respostas das APIs");
      }
  
      const { playlist } = await playlistRes.json();
      const { drinks } = await drinksRes.json();
  
      if (!playlist.length && !drinks.length) {
        resultado.innerHTML = "<p>Nenhum dado encontrado para esse humor.</p>";
        return;
      }
  
      let html = "<h2>Playlist</h2>";
      playlist.forEach(track => {
        html += `
          <div class="card">
            <strong>${track.name}</strong> - ${track.artist}<br>
            <a href="${track.url}" target="_blank">Ouvir no Last.fm</a>
          </div>`;
      });
  
      html += "<h2>Drinks</h2>";
      drinks.forEach(drink => {
        html += `
          <div class="card">
            <strong>${drink.name}</strong> (${drink.category})<br>
            <em>${drink.instructions}</em>
          </div>`;
      });
  
      resultado.innerHTML = html;
  
    } catch (error) {
      resultado.innerHTML = `<p class="error">Erro ao buscar dados: ${error.message}</p>`;
    }
  }
  