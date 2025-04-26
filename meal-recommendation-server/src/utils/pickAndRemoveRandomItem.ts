export default function pickAndRemoveRandomItem<T>(arr: T[]): T | null {
    if (arr.length === 0) {
      // If the array is empty, return null or handle accordingly
      return null;
    }
  
    // Generate a random index
    const randomIndex = Math.floor(Math.random() * arr.length);
  
    // Get the randomly picked item
    const pickedItem = arr[randomIndex];
  
    // Remove the item from the array
    arr.splice(randomIndex, 1);
  
    return pickedItem;
  }