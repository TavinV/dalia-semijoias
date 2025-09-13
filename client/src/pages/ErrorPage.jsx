import Header from "../components/layout/Header";

const ErrorPage = () => {
    return (
        <>
            <Header />
            <div className="min-h-screen w-full flex items-center justify-center">
                <h1 className="text-5xl font-title text-center">
                    Ocorreu um erro, por favor, volte mais tarde
                </h1>
            </div>
        </>
    );
}

export default ErrorPage