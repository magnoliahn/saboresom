// moodtosnackflavor e um objeto que mapeia humores para os sabores
const moodToSnackFlavor = {
  happy: [
    "cake",         // Doce, leve e comemorativo
    "cupcake",      // Individual e atrativo
    "brownie",      // Rico e indulgente
    "macarons",     // Sofisticado e colorido
    "cookies"       // Sempre uma opção clássica
  ],
  relax: [
    "cookies",      // Confortável e caseiro
    "muffin",       // Suave e reconfortante
    "scone",        // Tradicional e leve
    "biscotti",     // Combina com uma xícara de chá
    "shortbread"    // Doce e delicado
  ],
  focused: [
    "granola",      // Saudável e prática
    "nuts",         // Energia concentrada e prática
    "oatmeal",      // Leve e nutritivo
    "energy ball",  // Combinado para concentração
    "trail mix"     // Variante mista e energética
  ],
  romantic: [
    "chocolate",    // Sofisticado e clássico
    "truffle",      // Luxuoso e refinado
    "macarons",     // Delicado e atraente
    "strawberry tart", // Frutado e elegante
    "fondue"        // Interativo e romântico
  ],
  sad: [
    "ice cream",    // Confortante e gelado
    "pudding",      // Suave e reconfortante
    "cheesecake",   // Rico e indulgente
    "warm cookie",  // Aconchegante e reconfortante
    "brownie"       // Um doce para amenizar a melancolia
  ],
  angry: [
    "spicy-nuts",       // Picante e marcante
    "jalapeno chips",   // Intenso e ousado
    "popcorn",          // Variante simples, mas que pode ser temperada
    "hot wings",        // Para um gosto mais “explosivo” (se disponível)
    "wasabi peas"       // Picante e inesperado
  ],
  energetic: [
    "energy bar",       // Prático e funcional
    "fruit salad",      // Leve e refrescante
    "smoothie",         // Nutritivo e revigorante
    "protein bar",      // Repleto de energia
    "granola bar"       // Uma opção leve para sustentar a energia
  ]
};


async function getSnacksByMood(mood) {
  try {
    const snackFlavors = moodToSnackFlavor[mood] || ["cake"]; // se o humor de entrada nao existir no moodtosnackflavor 'cake' e usado como padrao
    const snackFlavor = snackFlavors[Math.floor(Math.random() * snackFlavors.length)];

    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${snackFlavor}`; //url para acessar themealdb, pesquisa de acordo com o parametro s que é o sabor
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro ao acessar a API TheMealDB (status ${response.status})`);
    }
    const data = await response.json(); // converte a res para json e armazena em data
    const meals = data.meals || []; // se data.meals for null || [] garante que drinks seja sempre um array, evitando erros

    // mapeia o drink para um objeto que contem so oq precisamos 
    return meals.map(meal => ({
      name: meal.strMeal,              
      image: meal.strMealThumb,        
      category: meal.strCategory,      
      instructions: meal.strInstructions 
    }));
  } catch (err) {
    console.error("Erro nos snacks:", err.message);
    throw err;
  }
}
  
// exporta as funcoes para que possam ser usadas em outros modulos
module.exports = {
  getSnacksByMood,
  moodToSnackFlavor,
};
