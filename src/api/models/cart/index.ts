export interface Cart {
  id: string;
  products: Array<{ productId: number; quantity: number }>;
}

export interface Product {
  productId: number;
  quantity: number;
}
