const Main = ({children}) => {
    return (
        <main className="min-h-screen px-8 md:px-15 mt-8 flex flex-col items-center">
            {children}
        </main>
    );
}

export default Main;