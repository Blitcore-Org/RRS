// src/components/Button.js
export default function Button({
  variant = "primary",
  text = "",
  loading = false,
  children,
  className = "",
  ...props
}) {
  const baseClasses = `
    flex
    h-12
    w-[200px]
    items-center
    justify-center
    rounded-[2px]
    shadow-[0px_1px_20px_-5px_rgba(0,0,0,0.10)]
    backdrop-blur-[5px]
    font-regular
  `;
  
  const variants = {
    primary: "bg-primary text-secondary",
    secondary: "bg-secondary text-primary",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <div className="animate-spin rounded-full border-t-2 border-b-2 border-current h-5 w-5" />
      ) : (
        text || children
      )}
    </button>
  );
}
