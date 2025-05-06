// Placeholder for shadcn/ui ScrollArea component
// Install via: npx shadcn-ui@latest add scroll-area
export const ScrollArea = ({ children, className }) => (
  <div className={\`overflow-auto \${className}\`}>{children}</div>
);
