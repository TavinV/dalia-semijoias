import Logo from "./Logo";
import { HiOutlineShoppingBag } from 'react-icons/hi';
import { BiSearchAlt2 } from 'react-icons/bi';

import { useState, useEffect } from "react";

import ShoppingCart from "../layout/ShoppingCart.jsx"

const NavItens = ({onCartClick}) => {
    const [cartCount, setCartCount] = useState(0);

    const loadCartCount = () => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartCount(cart.length);
    }

    useEffect(() => {
        loadCartCount();

        const handleStorageChange = () => loadCartCount();
        window.addEventListener("cartUpdated", handleStorageChange);

        return () => {
            window.removeEventListener("cartUpdated", handleStorageChange);
        }
    }, []);

    return (
        <div className="flex items-center gap-6">
            <button className="hover:scale-115 active:scale-95 transition-transform ease-in">
                <BiSearchAlt2 size={18} color={"var(--color-text)"} className="text-lg" />
            </button>
            <button className="hover:scale-115 active:scale-95 transition-transform ease-in" onClick={onCartClick}>
                <div className="relative">
                    {cartCount > 0 &&
                        <span className="absolute text-center -top-1 -right-1 bg-accent text-white text-xs font-bold rounded-full px-1">{cartCount > 9 ? "9+": cartCount}</span>
                    }
                    <HiOutlineShoppingBag size={18} color={"var(--color-text)"} className="text-lg" />
                </div>
            </button>
        </div>
    )
}


const Header = () => {
    const [cartOpen, setCartOpen] = useState(false)
    const toggleCartOpen = () => {setCartOpen(!cartOpen)}

    return (
        <header className="w-screen h-20 py-5 px-15 flex items-center justify-between bg-secondary shadow-md">
            <Logo />
            <NavItens onCartClick={toggleCartOpen}/>
            {cartOpen && <ShoppingCart onClose={toggleCartOpen} />}
        </header>
    )
}
export default Header;