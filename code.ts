// src/code.ts

figma.showUI(__html__, { width: 650, height: 300 });
let fullNames = ['Liam Müller', 'Emma Schmidt', 'Noah Becker', 'Olivia Wagner', 'Elias Richter', 'Sophia Schäfer', 'Mia Fischer', 'Lukas Hoffmann', 'Amelia Schulz', 'Benjamin Bauer', 'Emma Mayer', 'Paul Koch', 'Hannah Zimmermann', 'Leonard Schmitz'];
const shortNames = ['Liam', 'Emma', 'Noah', 'Olivia', 'Elias', 'Sophia', 'Mia', 'Lukas', 'Amelia', 'Benjamin', 'Emma', 'Paul', 'Hannah', 'Leonard'];


async function loadFontsAsync() {
  // Add the font names you are using in your plugin
  await Promise.all([
    figma.loadFontAsync({ family: "Inter", style: "Regular" }),
    // Add more fonts if needed
  ]);
}

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'searchText') {
    const searchQuery = msg.searchQuery;
    const selectedLayers = figma.currentPage.selection;
    console.log('selectedLayers', selectedLayers)
    if (selectedLayers.length > 0) {
      let count = 0;

      selectedLayers.forEach(layer => {
        if (layer) {
          console.log(layer)
        }
        if ('characters' in layer && layer.characters.includes(searchQuery)) {
          count++;
        }
      });
      console.log('count', count)
      // Send the result  back to the UI
      figma.ui.postMessage({ type: 'searchResult', count });
      figma.ui.postMessage({ type: 'toUI', data: count });
      // figma.ui.postMessage({ type: 'toUI', data: 'Hello from Figma plugin!' });
    } else {
      figma.ui.postMessage({ type: 'searchResult', count: 0 });
    }
  }
  if (msg.type === 'insertText') {
    const selectedLayers = figma.currentPage.selection;

    if (selectedLayers.length > 0) {
      // Load fonts before making changes
      await loadFontsAsync();

      // Create a copy of the names array to avoid modifying the original array
      const namesCopy = getListRandomData(msg.textToInsert) // [...msg.textToInsert];
      console.log('namesCopy', namesCopy)
      // Apply changes
      selectedLayers.forEach(async (layer, index) => {
        if ('characters' in layer) {
          let textToInsert = '';

          // Check if there are still names in the array
          if (namesCopy.length > 0) {
            // Get a unique name for the current layer
            textToInsert = getUniqueRandomItem(namesCopy);
          } else {
            // If the array is empty, reset it with the original data
            namesCopy.push(...msg.textToInsert);
            textToInsert = getUniqueRandomItem(namesCopy);
          }

          // Store the original text for undo purposes
          const originalText = ('characters' in layer) ? layer.characters : null;

          // Apply changes
          layer.characters = textToInsert;

          // Store the original text in the plugin data for undo purposes
          await figma.clientStorage.setAsync(`originalText_${index}`, JSON.stringify(originalText));
        }
      });
    } else {
      figma.closePlugin('Please select at least one layer.');
    }

  }
  if (msg.type === 'findAndInsert') {
    console.log(msg.findText, msg.replaceText)
    const findText = msg.findText;
    const replaceText = msg.replaceText;

    const selectedLayers = figma.currentPage.selection;
    console.log('selectedLayers.length', selectedLayers.length)
    if (selectedLayers.length > 0) {
      // Load fonts before making changes
      await loadFontsAsync();

      // Apply find-and-replace changes
      selectedLayers.forEach(async (layer, index) => {
        console.log('layer', layer)
        if ('characters' in layer) {
          // if (layer.type === "TEXT") {  // Check if the layer is a text layer

          const namesCopy = getListRandomData(replaceText) // [...msg.textToInsert];
          let textToInsert = '';
          // Check if there are still names in the array
          if (namesCopy.length > 0) {
            // Get a unique name for the current layer
            textToInsert = getUniqueRandomItem(namesCopy);
          } else {
            // If the array is empty, reset it with the original data
            namesCopy.push(...msg.textToInsert);
            textToInsert = getUniqueRandomItem(namesCopy);
          }

          // Get the current text content
          const currentText = layer.characters;
          console.log('currentText', currentText)

          // Replace the text
          const newText = currentText.replace(new RegExp(findText, 'g'), textToInsert);
          console.log('newText', newText)
          // Store the original text for undo purposes
          const originalText = ('characters' in layer) ? layer.characters : null;

          // Apply changes
          layer.characters = newText;

          // Store the original text in the plugin data for undo purposes
          await figma.clientStorage.setAsync(`originalText_${index}`, JSON.stringify(originalText));
        }
      });
    } else {
      figma.closePlugin('Please select at least one layer.');
    }
  }
};

function getUniqueRandomItem(array: any[]) {

  // if (array.length === 0) {
  //   // If the array is empty, reset it with the original data
  //   fullNames = ['Liam Müller', 'Emma Schmidt', 'Noah Becker', 'Olivia Wagner', 'Elias Richter', 'Sophia Schäfer', 'Mia Fischer', 'Lukas Hoffmann', 'Amelia Schulz', 'Benjamin Bauer', 'Emma Mayer', 'Paul Koch', 'Hannah Zimmermann', 'Leonard Schmitz'];
  //   return null; // Signal to reset the array
  // }
  console.log(array);
  const randomIndex = Math.floor(Math.random() * array.length);
  const uniqueItem = array.splice(randomIndex, 1)[0];
  console.log(uniqueItem[randomIndex]);
  console.log('---+)_)))))_');
  console.log(uniqueItem);
  console.log('_dwlaldlawldawldadwla');
  return uniqueItem;
}

const RANDOM_DATA_DRINK_WATER = [
  'Tap Water',
  'Bottled Spring Water',
  'Mineral Water',
  'Purified Water',
  'Sparkling Water',
  'Artesian Water',
  'Tap Water',
  'Bottled Spring Water',
  'Mineral Water',
  'Purified Water',
  'Sparkling Water',
  'Artesian Water',
  'Tap Water',
  'Bottled Spring Water',
  'Mineral Water',
  'Purified Water',
  'Sparkling Water',
  'Artesian Water',
  'Tap Water',
  'Bottled Spring Water',
  'Mineral Water',
  'Purified Water',
  'Sparkling Water',
  'Artesian Water',
]

const RANDOM_DATA_DRINK_COFFE = [
  'Espresso',
  'Americano',
  'Latte',
  'Cappuccino',
  'Macchiato',
  'Mocha',
  'Cold Brew',
  'Flat White',
  'Affogato',
  'Espresso',
  'Americano',
  'Latte',
  'Cappuccino',
  'Macchiato',
  'Mocha',
  'Cold Brew',
  'Flat White',
  'Affogato',
  'Espresso',
  'Americano',
  'Latte',
  'Cappuccino',
  'Macchiato',
  'Mocha',
  'Cold Brew',
  'Flat White',
  'Affogato'

]

const RANDOM_DATA_FOOD_JEPANESE = [
  'Sushi',
  'Sashimi',
  'Tempura',
  'Ramen',
  'Udon',
  'Sukiyaki',
  'Yakitori',
  'Okonomiyaki',
  'Takoyaki',
  'Donburi',
  'Chirashi',
  'Nigiri',
  'Miso',
  'Hōtō',
  'Kaiseki'
]

const RANDOM_DATA_FOOD_ITALY = [
  'Pizza',
  'Pasta',
  'Risotto',
  'Bruschetta',
  'Tiramisu',
  'Gelato',
  'Minestrone',
  'Cannelloni',
  'Pesto',
  'Calzone',
  'Carpaccio',
  'Gnocchi',
  'Arancini',
  'Amatriciana',
  'Frittata',
]

function getListRandomData(type: 'Italian Cuisine' | 'Japanese Cuisine' | 'Coffee' | 'Water') {
  if (type === 'Water') return RANDOM_DATA_DRINK_WATER;
  else if (type === 'Coffee') return RANDOM_DATA_DRINK_COFFE
  else if (type === 'Japanese Cuisine') return RANDOM_DATA_FOOD_JEPANESE
  else if (type === 'Italian Cuisine') return RANDOM_DATA_FOOD_ITALY
  return []
}
