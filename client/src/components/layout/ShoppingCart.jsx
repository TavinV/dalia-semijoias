// ShoppingCart.jsx
import React from "react";

const CartHeader = () => {
  return (
    <div className="hidden md:grid md:grid-cols-[1fr_minmax(100px,auto)_minmax(120px,auto)] items-center gap-x-8 py-3 border-b border-gray-300 font-semibold text-gray-700">
      <div>Produto</div>
      <div className="text-center">Quantidade</div>
      <div className="text-right">Subtotal</div>
    </div>
  );
};


const CartItem = ({ product }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_minmax(100px,auto)_minmax(120px,auto)] items-center gap-x-8 gap-y-4 py-4 border-b border-gray-300">
      {/* Coluna 1 - Imagem + Nome + Material */}
      <div className="flex gap-3 items-start">
        <img
          src={product.image}
          alt={product.name}
          className="w-16 h-16 object-cover rounded-md flex-shrink-0"
        />
        <div>
          <div className="md:hidden text-xs text-gray-500 mb-1">Produto</div>
          <p className="font-medium">{product.name}</p>
          <p className="text-sm text-gray-600">{product.material}</p>
          <button className="text-xs text-blue-600 underline mt-1">Alterar</button>
        </div>
      </div>

      {/* Coluna 2 - Quantidade */}
      <div>
        <div className="md:hidden text-xs text-gray-500 mb-1">Quantidade</div>
        <div className="flex items-center gap-2">
          <button className="px-2 h-8 border rounded text-sm">-</button>
          <span className="w-8 text-center">{product.qty}</span>
          <button className="px-2 h-8 border rounded text-sm">+</button>
        </div>
      </div>

      {/* Coluna 3 - Subtotal */}
      <div className="text-right">
        <div className="md:hidden text-xs text-gray-500 mb-1">Subtotal</div>
        <div className="font-medium">R$ {product.subtotal.toFixed(2)}</div>
      </div>
    </div>
  );
};


const ShoppingCart = ({ onClose }) => {
  // mock data
  const cart = [
    {
      name: "Anel Insp Chanel",
      material: "Ouro 18K",
      qty: 1,
      subtotal: 42,
      image: "https://source.unsplash.com/160x160/?ring,jewelry",
    },
    {
      name: "Anel 9 Linhas",
      material: "Ouro 18K",
      qty: 3,
      subtotal: 114,
      image: "https://source.unsplash.com/160x160/?gold,ring",
    },
    {
      name: "Corrente Elo Cartier",
      material: "Ouro 18K",
      qty: 1,
      subtotal: 42,
      image: "https://source.unsplash.com/160x160/?necklace,gold",
    },
  ];

  return (
    <div className="fixed top-20 right-0 w-full md:max-w-2xl bg-[#F3F3F3] shadow-lg z-50 p-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-gray-300 pb-2">
        <h2 className="text-xl font-bold">Carrinho</h2>
        <h2 className="text-xl font-bold">{cart.length} itens</h2>
      </div>

      {/* Labels da "tabela" (aparecem em md+) */}
      <CartHeader />

      {/* Lista de itens */}
      <div>
        {cart.map((item, i) => (
          <CartItem key={i} product={item} />
        ))}
      </div>

      {/* Rodapé */}
      <div className="flex flex-col sm:flex-row justify-between items-center border-t border-gray-300 pt-3 mt-3 gap-3">
        <button className="px-4 py-2 border border-gray-700 rounded-md">
          Finalizar pedido
        </button>
        <p className="font-bold">
          Total: R$ {cart.reduce((acc, item) => acc + item.subtotal, 0).toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default ShoppingCart;
