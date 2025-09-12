import Logo from "./Logo";
import { HiOutlineShoppingBag } from 'react-icons/hi';
import { BiSearchAlt2 } from 'react-icons/bi';

import { useState } from "react";
import { useCart } from "../../hooks/useCart.jsx";
    import ShoppingCart from "../layout/ShoppingCart.jsx"

const NavItens = ({onCartClick}) => {
    const {cart} = useCart();
    
    return (
        <div className="flex items-center gap-6">
            <button className="hover:scale-115 active:scale-95 transition-transform ease-in">
                <BiSearchAlt2 size={24} color={"var(--color-text)"} className="text-lg" />
            </button>
            <button className="hover:scale-115 active:scale-95 transition-transform ease-in" onClick={onCartClick}>
                <div className="relative">
                    {cart.length > 0 &&
                        <span className="absolute text-center -top-1 -right-1 bg-accent text-white text-xs font-bold rounded-full px-1">{cart.length > 9 ? "9+": cart.length}</span>
                    }
                    <HiOutlineShoppingBag size={24} color={"var(--color-text)"} className="text-lg" />
                </div>
            </button>
        </div>
    )
}


const Header = () => {
    const [cartOpen, setCartOpen] = useState(false)
    const toggleCartOpen = () => {setCartOpen(!cartOpen)}

    return (
        <header className="w-screen h-20 py-5 px-15 flex items-center justify-between bg-secondary shadow-2xl z-50">
            <Logo />
            <NavItens onCartClick={toggleCartOpen}/>
            {cartOpen && <ShoppingCart />}
        </header>
    )
}
export default Header;