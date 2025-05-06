// Placeholder for shadcn/ui Avatar component
// Install via: npx shadcn-ui@latest add avatar
export const Avatar = ({ children }) => <div className="w-10 h-10 rounded-full overflow-hidden">{children}</div>;
export const AvatarImage = ({ src, alt }) => <img src={src} alt={alt} className="w-full h-full object-cover" />;
export const AvatarFallback = ({ children }) => (
  <div className="w-full h-full flex items-center justify-center bg-gray-300">{children}</div>
);
