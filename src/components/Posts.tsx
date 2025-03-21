import { getUserPosts } from "@/actions/post.actions";
import PostItem from "./PostItem";

const Posts = async ({ username }: { username: string }) => {
  const posts = await getUserPosts(username);

  if (!posts) return null;

  return (
    <section className=" p-2  w-full flex flex-col items-center max-w-[700px]">
      {posts?.length === 0 ? (
        <div className="w-full flex flex-col items-center gap-2">
          <h1 className="text-lg">No posts yet!</h1>
          <p className="text-sm">
            Create posts or follow other users to see their posts
          </p>
        </div>
      ) : (
        posts?.map((post) => <PostItem key={post.id} post={post} />)
      )}
    </section>
  );
};

export default Posts;
