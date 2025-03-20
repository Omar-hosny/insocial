import { getCurrentUser } from "@/actions/auth.actions";
import { getPosts } from "@/actions/post.actions";
import CreatePost from "@/components/CreatePost";
import PostItem from "@/components/PostItem";
import ProfileCard from "@/components/ProfileCard";
import SuggestionCard from "@/components/SuggestionCard";

export default async function Home() {
  const user = await getCurrentUser();
  if (!user) return null;
  const posts = await getPosts();
  return (
    <div className=" mx-auto grid grid-cols-12 gap-2">
      <aside className="col-span-3 bg-gray-50 h-max dark:bg-transparent border rounded-2xl p-2">
        <ProfileCard />
      </aside>
      <main className="col-span-6 p-2  gap-2 flex flex-col items-center ">
        <section className=" p-2 border rounded-2xl w-full">
          <CreatePost />
        </section>

        <section className=" p-2  w-full flex flex-col items-center">
          {posts.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </section>
      </main>
      <aside className=" col-span-3 border rounded-2xl bg-gray-50 p-2 dark:bg-transparent h-max">
        <SuggestionCard />
      </aside>
    </div>
  );
}
