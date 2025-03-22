"use client";
import { Heart, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import { likePost } from "@/actions/post.actions";
import { startTransition, useOptimistic } from "react";

type LikeState = {
  count: number;
  isLiked: boolean;
};

const PostCartActions = ({
  postId,
  likesCount,
  commentsCount,
  isLiked,
}: {
  postId: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
}) => {
  const [optimisticState, setOptimisticState] = useOptimistic<LikeState>({
    count: likesCount,
    isLiked,
  });

  const handleLike = async () => {
    // Update optimistic state immediately for better UX
    startTransition(() => {
      setOptimisticState((prev) => ({
        count: prev.isLiked ? prev.count - 1 : prev.count + 1,
        isLiked: !prev.isLiked,
      }));
    });

    try {
      const likeData = await likePost(postId);
      console.log(likeData);
    } catch (error) {
      console.log(error);
      // Revert optimistic update on error
      startTransition(() => {
        setOptimisticState((prev) => ({
          count: prev.isLiked ? prev.count - 1 : prev.count + 1,
          isLiked: !prev.isLiked,
        }));
      });
    }
  };
  return (
    <div className="text-sm flex items-center gap-2 py-2">
      <Button
        onClick={handleLike}
        size="sm"
        variant="outline"
        className={
          optimisticState.isLiked
            ? "bg-red-100 text-red-500 hover:bg-red-200 hover:text-red-600"
            : ""
        }
      >
        <Heart
          size={18}
          className={optimisticState.isLiked ? "fill-red-500" : ""}
        />
      </Button>
      <span className="text-xs">{optimisticState.count} likes</span>
      <Button variant="outline" size="sm">
        <MessageCircle size={18} />
      </Button>
      <span className="text-xs">{commentsCount} comments</span>
    </div>
  );
};

export default PostCartActions;
