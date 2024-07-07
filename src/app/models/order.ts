import { Item } from "./item";
import { User } from "./user";

export interface Order{
    id:number;
    createdAt:Date;
    address: string;
    phoneNumber:string;
    status:string;
    totalAmount:number;
    customer: User | undefined; 
    items: Item[];
}