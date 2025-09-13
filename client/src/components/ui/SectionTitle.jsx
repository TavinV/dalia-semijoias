const SectionTitle = ({text}) => {
    return (
        <div className="flex flex-col justify-center text-center py-10">
            <h1 className="font-bold text-5xl uppercase font-highlight">{text}</h1>
            <div className="flex items-center w-full justify-center">
                <hr className="w-[100px] border-1 border-primary" />
                <img src="/star.svg" className="w-10 h-10" />
                <hr className="w-[100px] border-1 border-primary" />
            </div>
        </div>
    );
}

export default SectionTitle