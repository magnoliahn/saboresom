// carrega o DOM (html) antes de executar
document.addEventListener('DOMContentLoaded', () => {
  // seleciona os elementos do formulário e os campos onde os resultados serão exibidos
  const form = document.getElementById('mood-form');
  const moodSelect = document.getElementById('mood-select');
  const playlistDiv = document.getElementById('playlist-result');
  const drinkDiv = document.getElementById('drink-result');
  const snackDiv = document.getElementById('snack-result');

  if (!form || !moodSelect || !playlistDiv || !drinkDiv || !snackDiv) {
    console.error('Erro: Um ou mais elementos necessários não foram encontrados no DOM.');
    return; // Para a execução se faltar algum elemento
  }

  // addEventListener detecta quando o usuario clica em "ver sugestoes" e executa o codigo 
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // impede o comportamento padrao de submissao do formulário

    playlistDiv.textContent = 'Carregando playlist...';
    drinkDiv.textContent = 'Carregando drink...';
    snackDiv.textContent = 'Carregando snack...';

    // pega o humor selecionado
    const mood = moodSelect.value;
    console.log("Mood selecionado:", mood); 

    try {
      // realiza as tres requisicoes de endpoint
      const [playlistRes, drinkRes, snackRes] = await Promise.all([
        fetch(`/api/playlist/${mood}`),
        fetch(`/api/drinks/${mood}`),
        fetch(`/api/snacks/${mood}`)
      ]);

      // verifica se as tres foram bem sucedidas
      if (!playlistRes.ok || !drinkRes.ok || !snackRes.ok) {
        throw new Error('Uma ou mais requisições retornaram erro.');
      }

      // converte para json
      const playlistData = await playlistRes.json();
      const drinkData = await drinkRes.json();
      const snackData = await snackRes.json();

      console.log("Dados da Playlist:", playlistData);
      console.log("Dados do Drink:", drinkData);
      console.log("Dados do Snack:", snackData);


      // exibem as sugestoes: 
      if (playlistData.playlist) {
        const track = playlistData.playlist; 
        playlistDiv.innerHTML = `
          <p><strong>${track.name}</strong> por ${track.artist}</p>
          <a href="${track.url}" target="_blank">Ouça no Last.fm</a>
        `;
      } else {
        playlistDiv.textContent = 'Nenhuma playlist encontrada.';
      }

      if (drinkData.drinks) {
        const drink = drinkData.drinks;
        
        // se a categoria do drink for "Other / Unknown" nao exibe (fica feio)
        const categoryHtml = (drink.category && drink.category !== "Other / Unknown")
          ? `<p>${drink.category}</p>` 
          : '';
      
        drinkDiv.innerHTML = `
          <p><strong>${drink.name}</strong></p>
          <img src="${drink.image}" alt="${drink.name}" style="max-width:100px;">
          ${categoryHtml}
          <p>${drink.instructions}</p>
        `;
      } else {
        drinkDiv.textContent = 'Nenhum drink encontrado.';
      }
      

      if (snackData.snacks) {
        const snack = snackData.snacks; // receita vira uma lista enumerada
        const steps = snack.instructions.split(/\r?\n/).filter(line => line.trim() !== '');
        const stepsHtml = `<ol>${steps.map(step => `<li>${step}</li>`).join('')}</ol>`;

        snackDiv.innerHTML = `
          <p><strong>${snack.name}</strong></p>
          <img src="${snack.image}" alt="${snack.name}" style="max-width:100px;">
          <p>${snack.category}</p>
          ${stepsHtml}
        `;
      } else {
        snackDiv.textContent = 'Nenhum snack encontrado.';
      }

    } catch (error) {
      console.error('Erro ao buscar as sugestões:', error);
      playlistDiv.textContent = 'Erro ao obter sugestões.';
      drinkDiv.textContent = 'Erro ao obter sugestões.';
      snackDiv.textContent = 'Erro ao obter sugestões.';
    }
  });
});
