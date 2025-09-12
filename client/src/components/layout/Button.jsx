const Button = ({text, onClick}) => {
    return (
        <button className="font-title border-1 border-dark-accent py-2 px-4 rounded-[3px] hover:scale-102 active:scale-95 transition-all ease-in" onClick={onClick}>{text}</button>
    );
}

export default Button