import { z } from 'zod';

/**
 * Producto populado desde la API con .populate("products.product")
 */
export const PopulatedProductSchema = z.object({
  _id: z.string(),
  name: z.string(),
  price: z.number().optional(),
  image: z.string().optional(),
  description: z.string().optional(),
});

export type PopulatedProduct = z.infer<typeof PopulatedProductSchema>;

/**
 * Producto dentro del wishlist
 */
export const WishListProductSchema = z.object({
  product: PopulatedProductSchema,
  addedAt: z
    .string()
    .datetime()
    .optional()
    .default(() => new Date().toISOString()),
  isDefault: z.boolean(),
  isActive: z.boolean(),
});

export type WishListProduct = z.infer<typeof WishListProductSchema>;

/**
 * Wishlist principal
 */
export const WishListSchema = z.object({
  _id: z.string().min(1, 'El ID es requerido'),
  user: z.string().min(1, 'El usuario es requerido'),
  products: z.array(WishListProductSchema).default([]),
});

export type WishList = z.infer<typeof WishListSchema>;

export const WishListArraySchema = z.array(WishListSchema);

/**
 * Para crear wishlist (sin _id)
 */
export const CreateWishListSchema = WishListSchema.omit({
  _id: true,
});
export type CreateWishList = z.infer<typeof CreateWishListSchema>;

/**
 * Para actualizar wishlist
 */
export const UpdateWishListSchema = WishListSchema.partial().required({
  _id: true,
});
export type UpdateWishList = z.infer<typeof UpdateWishListSchema>;
