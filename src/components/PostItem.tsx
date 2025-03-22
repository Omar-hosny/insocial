/* eslint-disable @next/next/no-img-element */
import { getPosts } from "@/actions/post.actions";
import Image from "next/image";
import Link from "next/link";
import PostCartActions from "./PostCartActions";
import { getCurrentUser } from "@/actions/auth.actions";

type Posts = Awaited<ReturnType<typeof getPosts>>;
type Post = Posts[number];

const PostItem = async ({ post }: { post: Post }) => {
  const user = await getCurrentUser();
  if (!post) return null;
  return (
    <article className="w-full flex items-start gap-2 border rounded-xl my-2">
      <Link
        href={`/profile/${post.author.username}`}
        className="p-2  overflow-hidden"
      >
        <Image
          src={post.author.image ?? "/profile.png"}
          alt={post.author.name}
          width={35}
          height={35}
          className="rounded-full"
        />
      </Link>

      <div className="w-full flex items-start flex-col">
        <div className="flex items-center gap-1 w-full">
          <Link
            href={`/profile/${post.author.username}`}
            className="text-sm font-semibold"
          >
            <h1 className="text-lg">{post.author.name}</h1>
          </Link>

          <h2 className="text-sm text-gray-500">@{post.author.username}</h2>
        </div>
        <div className="w-full flex flex-col items-start">
          <p className="p-1">{post.content}</p>
          <div className="w-full  p-1.5">
            {post.image && (
              <div className="relative w-full aspect-[4/3] max-w-[400px] rounded-2xl">
                {/* // eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.image}
                  alt="Post image"
                  className="rounded-2xl w-full h-full object-fit"
                />
              </div>
            )}
          </div>
        </div>
        {/* post interactions */}
        <PostCartActions
          postId={post.id}
          isLiked={post.likes.some((like) => like.userId === user?.id)}
          likesCount={post.likes.length}
          commentsCount={post.comments.length}
        />
      </div>
    </article>
  );
};

export default PostItem;
