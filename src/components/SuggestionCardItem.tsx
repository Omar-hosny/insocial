import Image from "next/image";
import React from "react";
import FollowBtn from "./FollowBtn";
import Link from "next/link";

type User = {
  id: string;
  name: string;
  username: string;
  image: string | null;
  _count: {
    followers: number;
    following: number;
  };
};

const SuggestionCardItem = ({ user }: { user: User }) => {
  if (!user) return null;
  return (
    <div className="w-full flex items-center justify-between p-1">
      <div className="flex items-start gap-2">
        <Link
          href={`/profile/${user.username}`}
          id="image"
          className="overflow-hidden"
        >
          <Image
            width={38}
            height={38}
            src={user.image ?? "/profile.png"}
            alt={user.username}
            className="rounded-full"
          />
        </Link>
        <div className="w-full flex flex-col gap-0.5">
          <Link href={`/profile/${user.username}`}>
            <span className="font-semibold">{user.name}</span>
          </Link>
          <span className="text-sm text-gray-500">@{user.username}</span>
        </div>
      </div>

      <div>
        <FollowBtn followedId={user.id} />
      </div>
    </div>
  );
};

export default SuggestionCardItem;
