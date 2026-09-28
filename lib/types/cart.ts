export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  sku: string;
  color?: string;
  size?: string;
  quantity: number;
  unitPrice: number;
  image: string;
};
