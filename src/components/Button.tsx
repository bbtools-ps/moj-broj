interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export default function Button({ onClick, children }: ButtonProps) {
  return (
    <button
      type="button"
      className="m-auto flex w-auto items-center gap-2 rounded-md border-2 border-[#031572] bg-[#01a2fd] px-6 py-3 text-xl font-medium text-[#031572] hover:bg-[#031572] hover:text-white"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
