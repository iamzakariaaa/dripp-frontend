import { ItemDTO } from "./item.dto";

export interface OrderDTO {
    id: number;
    createdAt: Date;
    address: string;
    phoneNumber: string;
    status: string;
    totalAmount: number;
    items: ItemDTO[];
  }