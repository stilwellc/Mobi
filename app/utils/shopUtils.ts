import fs from 'fs';
import path from 'path';

export interface ShopItem {
  id: string;
  title: string;
  imagePath: string;
}

export function getShopItems(): ShopItem[] {
  const itemsDirectory = path.join(process.cwd(), 'images', 'items');
  
  try {
    // Read all files from the items directory
    const files = fs.readdirSync(itemsDirectory);
    
    // Filter for image files and create shop items
    return files
      .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
      .map(file => {
        // Convert filename to title (remove extension and replace hyphens with spaces)
        const title = file
          .replace(/\.(jpg|jpeg|png|webp)$/i, '')
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');

        return {
          id: file.replace(/\.(jpg|jpeg|png|webp)$/i, ''),
          title,
          imagePath: `/images/items/${file}`
        };
      });
  } catch (error) {
    console.error('Error reading shop items:', error);
    return [];
  }
} 