export const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
  
  export const generateCardSet = (images) => {
    const duplicatedImages = images.concat(images); // Paare bilden
    return shuffleArray(duplicatedImages.map((image, index) => ({
      id: index,
      url: image.url,
      matched: false,
    })));
  };
  