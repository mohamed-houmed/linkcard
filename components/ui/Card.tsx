type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({
  children,
  className = "",
}: CardProps) {
  return (
    <div
      className={`
        rounded-3xl
        border border-white/10
        bg-white/5
        p-6
        shadow-2xl
        shadow-black/20
        backdrop-blur-xl
        ${className}
      `}
    >
      {children}
    </div>
  );
}