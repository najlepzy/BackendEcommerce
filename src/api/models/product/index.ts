export interface Product {
  id: number;
  title: string;
  description: string;
  code: string;
  price: number;
  stock: number;
  category: string;
  thumbnails: string[];
  status: boolean;
}
