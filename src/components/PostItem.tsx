/* eslint-disable @next/next/no-img-element */
import { getPosts } from "@/actions/post.actions";
import { Heart, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Posts = Awaited<ReturnType<typeof getPosts>>;
type Post = Posts[number];

const PostItem = ({ post }: { post: Post }) => {
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
        <div className="text-sm flex items-center gap-2 py-2">
          <div className="flex items-center gap-0.5">
            <Heart size={18} />
            <p className="text-xs">{post.likes.length} likes</p>
          </div>
          <div className="flex items-center gap-0.5">
            <MessageCircle size={18} />
            <p className="text-xs">{post.comments.length} comments</p>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostItem;
