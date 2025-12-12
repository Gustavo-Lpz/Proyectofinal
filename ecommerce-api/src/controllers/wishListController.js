import WishList from '../models/wishList.js'
import product from '../models/product.js';

// ------------------------------------------
// Obtener wishlist del usuario autenticado
// ------------------------------------------
export const getUserWishList = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    let wishlist = await WishList.findOne({ user: userId }).populate("products.product");

    // Si no existe, crear una vacía
    if (!wishlist) {
      wishlist = await WishList.create({
        user: userId,
        products: []
      });
    }

    res.json(wishlist);
  } catch (error) {
    next(error);
  }
};

// ------------------------------------------
// Agregar producto
// ------------------------------------------
export const addToWishList = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.body;

    const wishlist = await WishList.findOne({ user: userId });

    // Si no existe, crearla
    if (!wishlist) {
      const newWishlist = await WishList.create({
        user: userId,
        products: [
          { product: productId, isDefault: false, isActive: true }
        ]
      });

      const populated = await newWishlist.populate("products.product");
      return res.json(populated);
    }

    // Evitar duplicados
    const exists = wishlist.products.some(
      (p) => p.product.toString() === productId
    );

    if (!exists) {
      wishlist.products.push({
        product: productId,
        isDefault: false,
        isActive: true,
        addedAt: new Date()
      });
      await wishlist.save();
    }

    const updated = await wishlist.populate("products.product");
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// ------------------------------------------
// Remover producto
// ------------------------------------------
export const removeFromWishList = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;

    const wishlist = await WishList.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.products = wishlist.products.filter(
      (p) => p.product.toString() !== productId
    );

    await wishlist.save();

    const updated = await wishlist.populate("products.product");
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// ------------------------------------------
// Limpiar wishlist
// ------------------------------------------
export const clearWishList = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const wishlist = await WishList.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.products = [];
    await wishlist.save();

    const updated = await wishlist.populate("products.product");
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// ------------------------------------------
// Verificar si producto está en wishlist
// ------------------------------------------
export const checkProductInWishList = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;

    const wishlist = await WishList.findOne({ user: userId });

    if (!wishlist) return res.json({ exists: false });

    const exists = wishlist.products.some(
      (p) => p.product.toString() === productId
    );

    res.json({ exists });
  } catch (error) {
    next(error);
  }
};

// ------------------------------------------
// Mover producto al carrito
// ------------------------------------------
export const moveToCart = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.body;

    // Aquí deberías llamar a tu CartService / CartModel
    // ejemplo:
    // await Cart.add(userId, productId)

    // Luego quitar de wishlist
    const wishlist = await WishList.findOne({ user: userId });

    wishlist.products = wishlist.products.filter(
      (p) => p.product.toString() !== productId
    );

    await wishlist.save();
    const updated = await wishlist.populate("products.product");

    res.json(updated);
  } catch (error) {
    next(error);
  }
};
