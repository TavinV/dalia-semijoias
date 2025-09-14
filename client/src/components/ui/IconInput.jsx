// src/components/ui/IconInput.jsx
const IconInput = ({ icon, ...props }) => {
    return (
        <div className="flex items-center gap-2 border border-[#BE8F6E] bg-[#F3F3F3] px-3 py-2 w-full focus-within:border-[#241F19] focus-within:ring-2 focus-within:ring-[#BE8F6E]/40 p-24">
            <span className="text-[#241F19] text-lg">{icon}</span>
            <input
                className="p-2 w-full bg-transparent outline-none text-sm text-[#241F19]"
                {...props}
            />
        </div>
    );
};

export default IconInput;
