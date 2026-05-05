import React, { createContext, useContext, useState, useEffect } from "react";
import { cartAPI } from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCart([]);
      return;
    }
    try {
      setLoading(true);
      const res = await cartAPI.get();
      if (res.data.success) {
        setCart(res.data.data.items || []);
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  const addToCart = async (productId, qty = 1) => {
    if (!isAuthenticated) {
      return { success: false, message: "Silakan login terlebih dahulu" };
    }
    try {
      setLoading(true);
      const res = await cartAPI.add({ productId, qty });
      if (res.data.success) {
        setCart(res.data.data.items);
        return { success: true, message: "Ditambahkan ke keranjang" };
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Gagal menambahkan item",
      };
    } finally {
      setLoading(false);
    }
  };

  const updateQty = async (itemId, qty) => {
    if (!isAuthenticated) return;
    try {
      // Optimistic UI update
      setCart((prev) =>
        prev.map((item) => (item._id === itemId ? { ...item, qty } : item))
      );
      
      const res = await cartAPI.update(itemId, { qty });
      if (res.data.success) {
        setCart(res.data.data.items);
      }
    } catch (error) {
      console.error("Failed to update qty:", error);
      fetchCart(); // Revert on failure
    }
  };

  const removeFromCart = async (itemId) => {
    if (!isAuthenticated) return;
    try {
      // Optimistic UI update
      setCart((prev) => prev.filter((item) => item._id !== itemId));
      
      const res = await cartAPI.remove(itemId);
      if (res.data.success) {
        setCart(res.data.data.items);
      }
    } catch (error) {
      console.error("Failed to remove item:", error);
      fetchCart(); // Revert on failure
    }
  };

  const clearCartState = () => setCart([]);

  const cartCount = cart.reduce((total, item) => total + item.qty, 0);
  const cartSubtotal = cart.reduce(
    (total, item) => total + (item.productId?.price || 0) * item.qty,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartSubtotal,
        loading,
        addToCart,
        updateQty,
        removeFromCart,
        fetchCart,
        clearCartState,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
