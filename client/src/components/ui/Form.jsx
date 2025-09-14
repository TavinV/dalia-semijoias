const Form = ({ title, subtitle, children, onSubmit }) => {
    return (
        <form
            onSubmit={onSubmit}
            className="flex flex-col w-full max-w-md bg-light-accent p-10"
        >
            {title && <h1 className="text-2xl font-semibold mb-2 text-dark">{title}</h1>}
            {subtitle && <p className="text-sm text-dark/70 mb-6">{subtitle}</p>}

            <div className="flex flex-col gap-4">{children}</div>
        </form>
    );
};

export default Form;
