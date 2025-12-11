import z from 'zod';
import { cartProductSchema } from './Products';
// import { shippingAddressSchema } from './ShippingAddress';
import { PaymentMethodSchema } from './PaymentMethod';
import { userSchema } from './User'; 
export const orderSchema = z.object({
  _id: z.string().optional(),
  user: z.string(),

  products: z.array(z.object({
    productId: z.string(),
    quantity: z.number(),
    price: z.number()
  })),

  shippingAddress: z.string(),   // required
  paymentMethod: z.string(),     // send string ID
  shippingCost: z.number(),
  totalPrice: z.number(),

  status: z.enum([
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled'
  ]),
});

export const orderArraySchema = z.array(orderSchema);

export type Order = z.infer<typeof orderSchema>;
