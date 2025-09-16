// ShoppingCart.jsx
import Button from "../ui/Button.jsx";
import generateWhatsAppLink from "../../utils/generateWhatsappLink.js";
import { useCart } from "../../hooks/useCart.jsx";

const CartHeader = () => {
  return (
    <div className="hidden md:grid md:grid-cols-[1fr_minmax(100px,auto)_minmax(120px,auto)] items-center gap-x-8 py-6 font-semibold text-gray-700">
      <div>Produto</div>
      <div className="text-center">Quantidade</div>
      <div className="text-right">Subtotal</div>
    </div>
  );
};


const CartItem = ({ product }) => {
  const { addItem, deductItem } = useCart();

  return (
    <article className="grid grid-cols-1 md:grid-cols-[1fr_minmax(100px,auto)_minmax(120px,auto)] items-start gap-x-8 gap-y-4">
      
      {/* Coluna 1 - Imagem + Nome + Material */}
      <div className="flex gap-3 items-start">
        <img
          src={product.image}
          alt={`Imagem de ${product.name}`}
          className="w-32 h-32 object-cover flex-shrink-0"
        />
        <div>
          <div className="md:hidden text-xs text-gray-500 mb-1">Produto</div>
          <p className="font-title uppercase font-semibold">{product.name}</p>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-sm font-title uppercase font-semibold">
              {product.material}
            </p>
          </div>
        </div>
      </div>

      {/* Colunas 2 e 3 agrupadas em telas pequenas */}
      <div className="md:hidden flex justify-between gap-4">
        {/* Quantidade */}
        <div className="flex-1">
          <div className="text-xs text-gray-500 mb-1">Quantidade</div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => deductItem(product)}
              className="px-2 h-8 text-xl"
            >
              -
            </button>
            <span className="w-8 h-8 flex items-center justify-center rounded border border-gray-300">
              {product.qty}
            </span>
            <button
              type="button"
              onClick={() => addItem(product)}
              className="px-2 h-8 text-xl"
            >
              +
            </button>
          </div>
        </div>

        {/* Subtotal */}
        <div className="flex-1 text-right">
          <div className="text-xs text-gray-500 mb-1">Subtotal</div>
          <div className="font-semibold">R$ {product.subtotal.toFixed(2)}</div>
        </div>
      </div>

      {/* Em telas md+ mantemos os itens separados */}
      <div className="hidden md:flex justify-center">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => deductItem(product)}
            className="px-2 h-8 text-xl"
          >
            -
          </button>
          <span className="w-8 h-8 flex items-center justify-center rounded border border-gray-300">
            {product.qty}
          </span>
          <button
            type="button"
            onClick={() => addItem(product)}
            className="px-2 h-8 text-xl"
          >
            +
          </button>
        </div>
      </div>

      <div className="hidden md:block text-right font-semibold">
        R$ {product.subtotal.toFixed(2)}
      </div>
    </article>
  );
};

const ShoppingCart = () => {
  const {cart, total} = useCart();

  return (
    <aside className="fixed top-20 right-0 w-full md:max-w-2xl bg-[#F3F3F3] shadow-lg z-50 p-4">
      {/* Header */}
      <header className="flex items-center justify-between border-b-2 border-gray-300 pb-2">
        <h2 className="text-xl font-bold">Carrinho</h2>
        <h2 className="text-xl font-bold">{cart.length > 1 ? cart.length + " itens" : "1 item"} </h2>
      </header>

      {/* Cabeçalho das colunas (somente md+) */}

      {/* Itens */}
      {
        cart.length === 0 ? 
        <h1 className="mt-8 font-title text-xl">Ainda não há itens no carrinho.</h1> :  
        <>
          <CartHeader />
          <section className="flex flex-col gap-6 mt-4 overflow-auto max-h-80">
            {cart.map((item) => (
              <CartItem key={item.id} product={item} />
            ))}
          </section>
        </>
      }

      {/* Rodapé */}
      {
        cart.length === 0 ? <></>: 
        <footer className="flex justify-between items-center border-t border-gray-300 pt-3 mt-4 gap-3">
          <div className="flex items-stretch gap-4">
              <Button text="Finalizar pedido" onClick={() => window.location.href = generateWhatsAppLink(cart)} />

          </div>

          <div className="text-right flex flex-col">
            <p className="">
              Total
            </p>
            <p className="text-lg">
              R$ {total}
            </p>
          </div>
        </footer>

      }

    </aside>
  );
};

export default ShoppingCart;
