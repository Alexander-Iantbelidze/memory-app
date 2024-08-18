export const fetchImages = (count = 8) => {
    return Array.from({ length: count }, (_, index) => ({
      id: index,
      url: `https://picsum.photos/300/300?random=${index}`,
    }));
  };
  