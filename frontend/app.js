// Aguarda o carregamento total do DOM (estrutura HTML) antes de executar o código
document.addEventListener('DOMContentLoaded', () => {
  // Seleciona os elementos do formulário e os campos onde os resultados serão exibidos
  const form = document.getElementById('mood-form');
  const moodSelect = document.getElementById('mood-select');
  const playlistDiv = document.getElementById('playlist-result');
  const drinkDiv = document.getElementById('drink-result');
  const snackDiv = document.getElementById('snack-result');

  // Verifica se todos os elementos necessários existem no DOM
  if (!form || !moodSelect || !playlistDiv || !drinkDiv || !snackDiv) {
    console.error('Erro: Um ou mais elementos necessários não foram encontrados no DOM.');
    return; // Para a execução se faltar algum elemento
  }

  // Adiciona um ouvinte para o evento de submissão do formulário
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Impede o comportamento padrão de submissão do formulário

    console.log("Formulário submetido."); // Log para depuração
    // Exibe mensagens de carregamento nas áreas de resultado
    playlistDiv.textContent = 'Carregando playlist...';
    drinkDiv.textContent = 'Carregando drink...';
    snackDiv.textContent = 'Carregando snack...';

    // Obtém o humor selecionado no campo do formulário
    const mood = moodSelect.value;
    console.log("Mood selecionado:", mood); // Log com o humor escolhido

    try {
      // Realiza as três requisições para os endpoints de playlist, drinks e snacks em paralelo
      const [playlistRes, drinkRes, snackRes] = await Promise.all([
        fetch(`/api/playlist/${mood}`),
        fetch(`/api/drinks/${mood}`),
        fetch(`/api/snacks/${mood}`)
      ]);

      // Verifica se todas as requisições foram bem-sucedidas
      if (!playlistRes.ok || !drinkRes.ok || !snackRes.ok) {
        throw new Error('Uma ou mais requisições retornaram erro.');
      }

      // Converte as respostas para JSON
      const playlistData = await playlistRes.json();
      const drinkData = await drinkRes.json();
      const snackData = await snackRes.json();

      console.log("Dados da Playlist:", playlistData);
      console.log("Dados do Drink:", drinkData);
      console.log("Dados do Snack:", snackData);

      // Exibe a sugestão de playlist (objeto único)
      if (playlistData.playlist) {
        const track = playlistData.playlist; // Pega o objeto retornado
        playlistDiv.innerHTML = `
          <p><strong>${track.name}</strong> por ${track.artist}</p>
          <a href="${track.url}" target="_blank">Ouça no Last.fm</a>
        `;
      } else {
        playlistDiv.textContent = 'Nenhuma playlist encontrada.';
      }

      // Exibe a sugestão de drink (objeto único)
      if (drinkData.drinks) {
        const drink = drinkData.drinks;
        
        // Se a categoria for "Other / Unknown", não exibe nada
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
      

      // Exibe a sugestão de snack (objeto único)
      if (snackData.snacks) {
        const snack = snackData.snacks; 

        // Divide as instruções por quebras de linha e remove linhas vazias
        const steps = snack.instructions.split(/\r?\n/).filter(line => line.trim() !== '');
        
        // Constrói uma lista ordenada (ol) onde cada linha é um item (li)
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
      // Em caso de erro, exibe a mensagem de erro no console e atualiza os campos de resultado
      console.error('Erro ao buscar as sugestões:', error);
      playlistDiv.textContent = 'Erro ao obter sugestões.';
      drinkDiv.textContent = 'Erro ao obter sugestões.';
      snackDiv.textContent = 'Erro ao obter sugestões.';
    }
  });
});
