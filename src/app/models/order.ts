import { Item } from "./item";

export interface Order{
    id:number;
    createdAt:Date;
    shippingAddress: string;
    phoneNumber:string;
    status:string;
    totalAmount:number;
    customer: { id: number; name: string }; 
    items: Item[];
}