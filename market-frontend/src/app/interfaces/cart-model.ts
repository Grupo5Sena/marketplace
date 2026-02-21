import { Products } from "./product-model";


export interface CartItem {
  id?: string;            // 👈 backend cartItem.id (opcional)
  product: Products;
  quantity: number;
  variant?: any;
}