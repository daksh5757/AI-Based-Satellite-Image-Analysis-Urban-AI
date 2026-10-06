import { Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between lg:justify-start">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
      >
        <Menu className="w-6 h-6" />
      </button>

      <h1 className="text-xl font-semibold text-gray-900">
        AI Urban Planning Assistant
      </h1>
    </header>
  );
}
