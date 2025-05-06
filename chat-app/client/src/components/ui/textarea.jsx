// Placeholder for shadcn/ui Textarea component
// Install via: npx shadcn-ui@latest add textarea
export const Textarea = ({ name, placeholder, value, onChange, onKeyDown, className, disabled }) => {
  return (
    <textarea
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      className={\`w-full px-3 py-2 border rounded-md \${className}\`}
      disabled={disabled}
    />
  );
};
