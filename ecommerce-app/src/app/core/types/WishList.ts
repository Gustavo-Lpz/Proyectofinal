import { z } from 'zod';

export const WishListProductSchema = z.object({
  product: z.string().min(1, 'El producto es requerido'),
  addedAt: z
    .string()
    .datetime()
    .optional()
    .default(() => new Date().toISOString()),

    isDefault: z.boolean(),
    isActive: z.boolean(),

    
});

export type WishListProduct = z.infer<typeof WishListProductSchema>;

export const WishListSchema = z.object({
  _id: z.string().min(1, 'El ID es requerido'),

  user: z.string().min(1, 'El usuario es requerido'),

  products: z.array(WishListProductSchema).default([]),
});

export type WishList = z.infer<typeof WishListSchema>;

export const WishListArraySchema = z.array(WishListSchema);

// Create (sin _id)
export const CreateWishListSchema = WishListSchema.omit({
  _id: true,
});
export type CreateWishList = z.infer<typeof CreateWishListSchema>;

// Update (parcial, pero _id requerido)
export const UpdateWishListSchema = WishListSchema.partial().required({
  _id: true,
});
export type UpdateWishList = z.infer<typeof UpdateWishListSchema>;