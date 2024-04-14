import { Category } from "./Category";

export interface Menu {
  id?: number;
  name: string;
  description?: string;
  available: boolean;
  categoryId: number;
  price: number;
  tax?: number;
  img?: string;
  prepTime?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  Category?: Category;
}

export interface UpdateMenu {
  name: string;
  description?: string;
  available: boolean;
  categoryId: number;
  price: number;
  tax?: number;
  img?: string;
  prepTime?: string;
}
