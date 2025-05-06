// Placeholder for shadcn/ui Button component
// Install via: npx shadcn-ui@latest add button
export const Button = ({ children, className, onClick, disabled, variant }) => {
  return (
    <button
      className={\`px-4 py-2 rounded-md \${variant === "outline" ? "border border-gray-300" : "bg-blue-500 text-white"} \${className}\`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
