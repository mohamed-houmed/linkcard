type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

export default function Button({
  children,
  onClick,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="
        rounded-xl
        bg-blue-600
        px-5
        py-3
        text-white
        font-medium
        hover:bg-blue-700
        transition
      "
    >
      {children}
    </button>
  );
}