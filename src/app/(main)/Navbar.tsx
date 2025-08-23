import SearchField from "@/components/SearchField";
import UserButton from "@/components/UserButton";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-3">
        {/* Brand */}
        <Link
          href="/"
          className="text-brand text-2xl font-bold tracking-tight transition-opacity hover:opacity-90"
        >
          Pulse
        </Link>

        {/* Search field */}
        <div className="hidden max-w-lg flex-1 sm:block">
          <SearchField />
        </div>

        {/* User button */}
        <div className="sm:ml-auto">
          <UserButton />
        </div>
      </div>
    </header>
  );
}
