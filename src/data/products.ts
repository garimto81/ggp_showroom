export interface Product {
  id: string;
  name: string;
  category: 'tops' | 'bottoms' | 'outerwear';
  image: string;
  position: [number, number, number];
  rotation: [number, number, number];
  description?: string;
  price?: string;
}

export const products: Product[] = [
  {
    id: 'top-1',
    name: 'Classic White Shirt',
    category: 'tops',
    image: '/images/products/top-1.svg',
    position: [-3, 1.5, 3],
    rotation: [0, Math.PI / 6, 0],
    description: 'Timeless elegance in pure cotton',
    price: '$120',
  },
  {
    id: 'bottom-1',
    name: 'Tailored Trousers',
    category: 'bottoms',
    image: '/images/products/bottom-1.svg',
    position: [-4, 1.5, -1],
    rotation: [0, Math.PI / 5, 0],
    description: 'Perfect fit for every occasion',
    price: '$195',
  },
  {
    id: 'outer-1',
    name: 'Wool Coat',
    category: 'outerwear',
    image: '/images/products/outer-1.svg',
    position: [-4.5, 1.5, -5],
    rotation: [0, Math.PI / 4, 0],
    description: 'Italian wool craftsmanship',
    price: '$450',
  },
  {
    id: 'top-2',
    name: 'Navy Sweater',
    category: 'tops',
    image: '/images/products/top-2.svg',
    position: [3, 1.5, 3],
    rotation: [0, -Math.PI / 6, 0],
    description: 'Soft merino wool blend',
    price: '$180',
  },
  {
    id: 'bottom-2',
    name: 'Denim Jeans',
    category: 'bottoms',
    image: '/images/products/bottom-2.svg',
    position: [4, 1.5, -1],
    rotation: [0, -Math.PI / 5, 0],
    description: 'Japanese selvedge denim',
    price: '$220',
  },
  {
    id: 'outer-2',
    name: 'Leather Jacket',
    category: 'outerwear',
    image: '/images/products/outer-2.svg',
    position: [4.5, 1.5, -5],
    rotation: [0, -Math.PI / 4, 0],
    description: 'Premium lambskin leather',
    price: '$580',
  },
  {
    id: 'top-3',
    name: 'Striped Tee',
    category: 'tops',
    image: '/images/products/top-3.svg',
    position: [-2, 1.5, -8],
    rotation: [0, 0, 0],
    description: 'Casual comfort meets style',
    price: '$65',
  },
  {
    id: 'bottom-3',
    name: 'Chino Pants',
    category: 'bottoms',
    image: '/images/products/bottom-3.svg',
    position: [0, 1.5, -8],
    rotation: [0, 0, 0],
    description: 'Versatile everyday essential',
    price: '$145',
  },
  {
    id: 'outer-3',
    name: 'Trench Coat',
    category: 'outerwear',
    image: '/images/products/outer-3.svg',
    position: [2, 1.5, -8],
    rotation: [0, 0, 0],
    description: 'Classic British heritage',
    price: '$395',
  },
];

export const categories = ['tops', 'bottoms', 'outerwear'] as const;
export type Category = (typeof categories)[number];
