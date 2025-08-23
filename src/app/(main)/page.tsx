import PostEditor from "@/components/posts/editor/PostEditor";
import TrendsSidebar from "@/components/TrendsSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FollowingFeed from "./FollowingFeed";
import ForYouFeed from "./ForYouFeed";

export default function Home() {
  return (
    <main className="flex w-full min-w-0 gap-6">
      {/* Main content */}
      <div className="min-w-0 flex-1 space-y-6">
        {/* Post editor */}
        <section className="rounded-xl bg-card p-4 shadow-sm sm:p-6">
          <PostEditor />
        </section>

        {/* Tabs for feeds */}
        <Tabs defaultValue="for-you" className="w-full">
          <TabsList className="w-full justify-start gap-6 border-b border-border bg-transparent p-0">
            <TabsTrigger
              value="for-you"
              className="data-[state=active]:text-brand relative pb-3 text-lg font-medium tracking-tight"
            >
              For you
              <span className="bg-brand absolute -bottom-[1px] left-0 h-0.5 w-full transition-all duration-200 data-[state=inactive]:w-0"></span>
            </TabsTrigger>
            <TabsTrigger
              value="following"
              className="data-[state=active]:text-brand relative pb-3 text-lg font-medium tracking-tight"
            >
              Following
              <span className="bg-brand absolute -bottom-[1px] left-0 h-0.5 w-full transition-all duration-200 data-[state=inactive]:w-0"></span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <TabsContent value="for-you" className="space-y-5">
              <ForYouFeed />
            </TabsContent>
            <TabsContent value="following" className="space-y-5">
              <FollowingFeed />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Sidebar (hidden on mobile) */}
      <aside className="hidden w-80 shrink-0 lg:block">
        <TrendsSidebar />
      </aside>
    </main>
  );
}
