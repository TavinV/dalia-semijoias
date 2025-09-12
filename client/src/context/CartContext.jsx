import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  }, [cart]);


  const addItem = (item) => {
    setCart((prev) => {
      const exists = prev.find((p) => p.id === item.id);
      if (exists) {
        return prev.map((p) =>
          p.id === item.id
            ? { ...p, qty: p.qty + 1, subtotal: (p.qty + 1) * item.price }
            : p
        );
      }
      return [...prev, { ...item, qty: 1, subtotal: item.price }];
    });
  };

  const deductItem = (item) => {
    setCart((prev) => {
      const exists = prev.find((p) => p.id === item.id);
  
      if (!exists) return prev; // nada a remover
  
      if (exists.qty > 1) {
        return prev.map((p) =>
          p.id === item.id
            ? { ...p, qty: p.qty - 1, subtotal: (p.qty - 1) * p.price }
            : p
        );
      } else {
        return prev.filter((p) => p.id !== item.id);
      }
    });
  };
  

  const removeItem = (id) => setCart((prev) => prev.filter((p) => p.id !== id));
  const clearCart = () => setCart([]);

  const total = cart.reduce((acc, i) => acc + i.subtotal, 0).toFixed(2);

  return (
    <CartContext.Provider value={{ cart, total, addItem, removeItem, clearCart, deductItem }}>
      {children}
    </CartContext.Provider>
  );
}
