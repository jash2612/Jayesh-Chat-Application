// Placeholder for shadcn/ui Input component
// Install via: npx shadcn-ui@latest add input
export const Input = ({ type, name, placeholder, value, onChange, className }) => {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={\`w-full px-3 py-2 border rounded-md \${className}\`}
    />
  );
};
