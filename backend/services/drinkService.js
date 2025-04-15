// mapeia cada humor para uma lista de drinks 
const moodToFlavor = {
  happy: ["Margarita", "Cosmopolitan", "Daiquiri", "Mai Tai"],
  relax: ["Mojito", "Pina Colada", "Caipirinha", "Mint Julep"],
  focused: ["Espresso Martini", "Black Russian", "Irish Coffee"],
  romantic: ["French 75", "Bellini", "Sidecar"],
  sad: ["Old Fashioned", "Whiskey Sour", "Manhattan"],
  angry: ["Bloody Mary", "Negroni", "Sazerac"],
  energetic: ["Vodka Red Bull", "Screwdriver", "Tom Collins"]
};

async function getDrinksByMood(mood) { // funcao assincrona para obter os snacks com base no humor
  try {
    const flavors = moodToFlavor[mood] || ["Margarita"]; // se o humor nao existir margarita é drink default
    
    const drinkName = flavors[Math.floor(Math.random() * flavors.length)]; // escolhe um drink aleatorio da lista
    
    const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${encodeURIComponent(drinkName)}`; // URL usa o parâmetro 's' para buscar pelo nome do drink na api
    
    const response = await fetch(url);
    if (!response.ok) {
      // Caso a requisição não seja bem sucedida, lança um erro com o status HTTP retornado
      throw new Error(`Erro ao acessar a API TheCocktailDB (status ${response.status})`);
    }
    
    // converte a resposta do api para json
    const data = await response.json();
    
    if (!data.drinks) {
      // se a api nao encontrar um drink tenta buscar um  aleatorio como fallback
      const randomResponse = await fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php');
      if (!randomResponse.ok)
        throw new Error('Erro na busca aleatória do drink');
      const randomData = await randomResponse.json();
      
      // mapeia os dados retornados para usar somente o que precisamos
      return randomData.drinks.map(drink => ({
        name: drink.strDrink,             
        category: drink.strCategory,      
        instructions: drink.strInstructions 
      }));
    }
    
    // se a api encontrar um drink, mapeia os dados para o formato desejado
    return data.drinks.map(drink => ({
      name: drink.strDrink,
      image: drink.strDrinkThumb,
      category: drink.strCategory,
      instructions: drink.strInstructions
    }));
    
  } catch (err) {
    console.error("Erro nos drinks:", err.message);
    throw err;
  }
}

// exporta a funcao e o objeto para que possam ser usados em outros modulos
module.exports = {
  getDrinksByMood,
  moodToFlavor,
};
