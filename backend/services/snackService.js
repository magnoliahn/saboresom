// mapeia cada humor para uma lista de snacks 
const moodToSnackFlavor = {
  happy: ["Cheesecake", "Chocolate Cake", "Cupcake", "Apple Pie"], 
  relax: ["Muffin", "Shortbread", "Scone", "Madeleine"],           
  focused: ["Granola", "Oatmeal", "Energy Bar"],                     
  romantic: ["Tiramisu", "Macarons", "Pavlova"],                     
  sad: ["Ice Cream", "Brownie", "Creme Brulee"],                       
  angry: ["Hot Wings", "Spicy Nuts", "Jalapeno Poppers"],            
  energetic: ["Smoothie", "Protein Bar", "Fruit Salad"]              
};

async function getSnacksByMood(mood) { // funcao assincrona para obter os snacks com base no humor
  try {
    const snackFlavors = moodToSnackFlavor[mood] || ["Cheesecake"]; // se o humor nao existir cheesecake é snack default
    
    const snackName = snackFlavors[Math.floor(Math.random() * snackFlavors.length)]; // escolhe um snack aleatorio da lista
    
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(snackName)}`; // URL usa o parâmetro 's' para buscar pelo nome do snack na api
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Erro ao acessar a API TheMealDB (status ${response.status})`);
    }
    
    // converte a resposta do api para json
    const data = await response.json();
    
    if (!data.meals) {
      // se a api nao encontrar um snack tenta buscar um  aleatorio usando o endpoint de receita aleatoria
      const randomResponse = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
      if (!randomResponse.ok) throw new Error('Erro na busca aleatória do snack');
      const randomData = await randomResponse.json();
      
      // mapeia os dados retornados para usar somente o que precisamos
      return randomData.meals.map(meal => ({
        name: meal.strMeal,           
        image: meal.strMealThumb,     
        category: meal.strCategory,   
        instructions: meal.strInstructions 
      }));
    }
    
    //  se a api encontrar um snack, mapeia os dados para o formato desejado
    return data.meals.map(meal => ({
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

// exporta a funcao e o objeto para que possam ser usados em outros modulos
module.exports = {
  getSnacksByMood,
  moodToSnackFlavor,
};
