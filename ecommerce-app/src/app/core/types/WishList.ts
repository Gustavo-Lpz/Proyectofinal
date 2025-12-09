import { z } from "zod";

export const PopulatedProductSchema = z.object({
  _id: z.string(),
  name: z.string(),
  price: z.number(),
  images: z.array(z.string()).optional(),
  category: z.string().optional(),
  inStock: z.boolean().optional()
});

export const WishListProductSchema = z.object({
  product: PopulatedProductSchema, // <-- AQUÍ SE CORRIGE
  addedAt: z.string().optional(),
});

export type WishListProduct = z.infer<typeof WishListProductSchema>;

export const WishListSchema = z.object({
  _id: z.string(),
  user: z.string(),
  products: z.array(WishListProductSchema),
});

export type WishList = z.infer<typeof WishListSchema>;
