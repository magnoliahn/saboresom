// moodtoflavor e um objeto que mapeia humores para os sabores 
const moodToFlavor = {
  happy: [
    "fruit",        // Básico, remete a bebidas frutadas
    "tropical",     // Exótico e vibrante
    "berry",        // Refrescante e doce
    "sunshine",     // Termo simbólico para alegria
    "citrus"        // Remete a sabores leves e refrescantes
  ],
  relax: [
    "lemon",        // Refrescante
    "iced tea",     // Bebida suave e relaxante
    "herbal",       // Infusões que relaxam
    "chamomile",    // Conhecida por seu efeito calmante
    "cucumber"      // Sabor refrescante e leve
  ],
  focused: [
    "espresso",         // Estimulante e encorpado
    "black coffee",     // Clássico para concentração
    "amaro",            // Bebida amarga, sofisticada
    "robust",           // Remete a sabores fortes
    "cocoa"             // Para dar um toque de energia e foco
  ],
  romantic: [
    "cream",            // Suave e aveludado
    "rosewater",        // Delicado e floral
    "vanilla",          // Aconchegante e doce
    "champagne",        // Sofisticado e festivo
    "sparkling"         // Bebidas com gás que trazem elegância
  ],
  sad: [
    "berry",        // Pode ter um toque melancólico
    "sour",         // Remete ao amargor que muitas vezes acompanha a tristeza
    "coffee",       // Pode ser reconfortante
    "bitters",      // Notas amargas que podem refletir o humor
    "chocolate"     // Confortante e indulgente
  ],
  angry: [
    "spicy",        // Intenso e picante
    "smoky",        // Defumado e marcante
    "bitters",      // Intenso e complexo
    "fiery",        // Expressivo para um humor mais agressivo
    "zesty"         // Um toque ácido para dinamismo
  ],
  energetic: [
    "mint",         // Refrescante e revigorante
    "citrus",       // Vibrante e estimulante
    "ginseng",      // Energético e natural
    "energy boost", // Sugerindo um incremento de energia
    "zest"          // Relacionado à vitalidade e frescor
  ]
};


async function getDrinksByMood(mood) {
  try {
    const flavors = moodToFlavor[mood] || ["fruit"]; // se o humor de entrada nao existir no moodtoflavor 'fruit' e usado como padrao
    const flavor = flavors[Math.floor(Math.random() * flavors.length)];
    
    // url de busca de acordo com o sabor informado, e usa o endpoint do thecocktaildb para fazer a req
    const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${flavor}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erro ao acessar a API TheCocktailDB (status ${response.status})`);
    }
    
    const data = await response.json();

    const drinks = data.drinks || []; // se data.drinks for null || [] garante que drinks seja sempre um array, evitando erros

    // mapeia o drink para um objeto que contem so oq precisamos 
    return drinks.map(drink => ({
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
  
// exporta as funcoes para que possam ser usadas em outros modulos
module.exports = {
  getDrinksByMood,
  moodToFlavor,
};
