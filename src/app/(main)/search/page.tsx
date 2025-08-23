import TrendsSidebar from "@/components/TrendsSidebar";
import { Metadata } from "next";
import SearchResults from "./SearchResults";

interface PageProps {
  searchParams: { q: string };
}

export function generateMetadata({ searchParams: { q } }: PageProps): Metadata {
  return {
    title: `Search results for "${q}"`,
  };
}

export default function Page({ searchParams: { q } }: PageProps) {
  return (
    <main className="flex w-full min-w-0 gap-6">
      {/* Main content */}
      <div className="w-full min-w-0 space-y-6">
        {/* Search header */}
        <div className="rounded-2xl bg-card p-6 shadow-sm">
          <h1 className="mb-2 break-words text-center text-2xl font-bold">
            Results for <span className="text-primary">&quot;{q}&quot;</span>
          </h1>
          <p className="text-center text-sm text-muted-foreground">
            Showing latest posts, users, and more related to your search.
          </p>
        </div>

        {/* Results */}
        <div className="rounded-2xl bg-card p-4 shadow-sm">
          <SearchResults query={q} />
        </div>
      </div>

      {/* Sidebar */}
      <aside className="hidden w-80 shrink-0 lg:block">
        <TrendsSidebar />
      </aside>
    </main>
  );
}
