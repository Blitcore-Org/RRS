// src/components/Button.js
export default function Button({ variant = "primary", children, ...props }) {
    const baseClasses = `
        flex
        h-9
        w-[200px]
        items-center
        justify-center
        rounded-[32px]
        shadow-[0px_1px_20px_-5px_rgba(0,0,0,0.10)]
        backdrop-blur-[5px]
        font-regular
    `;
    const variants = {
        primary: "bg-primary text-secondary",
        secondary: "bg-secondary text-primary",
    };

    return (
        <button className={`${baseClasses} ${variants[variant]}`} {...props}>
            {children}
        </button>
    );
}
