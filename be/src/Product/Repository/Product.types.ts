import { ObjectId } from "mongodb";

export interface IProduct {
  name: string;
  description: string;
  image_url: string;
  in_stock?: boolean;
  serial_num: string;
  quantity: number;
}

export interface IProductRequest{
  product_id: ObjectId;
  requested_by: ObjectId;
  is_approved:boolean;
}

