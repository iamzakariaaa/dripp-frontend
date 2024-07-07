import { Order } from "./order";
import { Product } from "./product";

export interface Item {
    id: number;
    product: Product;
    quantity: number;
    amount: number;
    order:Order;
  }
  