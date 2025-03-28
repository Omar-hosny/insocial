import { getUserByUsername } from "@/actions/auth.actions";
import Posts from "@/components/Posts";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Params = Promise<{
  username: string;
}>;
const ProfilePage = async ({ params }: { params: Params }) => {
  // Directly use the username from params without any await
  const { username } = await params;

  console.log("Resolved username:", username); // Debugging log

  const user = await getUserByUsername(username);
  if (!user) return null;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full flex flex-col items-center bg-neutral-50 dark:bg-transparent rounded-2xl p-2 max-w-[750px]">
        {/* Avatar */}
        <div className="rounded-full overflow-hidden">
          <Image
            src={user.image || "/profile.png"}
            alt={user.name}
            width={50}
            height={50}
            className="rounded-full"
          />
        </div>
        {/* Name */}
        <div className="flex flex-col items-center gap-1">
          <Link href={`/profile/${user.username}`}>
            <p>{user.name}</p>
          </Link>
          <p className="text-gray-400 dark:text-gray-50 text-sm">
            @{user.username}
          </p>
        </div>
        {/* Bio */}
        <div className="text-center text-gray-500 text-sm mt-1">
          {user.bio || "No bio"}
        </div>
        {/* Followers / Following */}
        <div className="flex items-center justify-around gap-2 mt-2 w-5/6 max-w-xl dark:text-gray-200 text-gray-500">
          <p className="text-sm">{user._count.followers} followers</p>
          <p className="text-sm">{user._count.following} following</p>
        </div>
        <span className="w-5/6 h-[2px] bg-gray-200 mt-2"></span>
      </div>

      <div className="text-2xl pt-2 text-neutral-500">
        <h2>Your Posts</h2>
      </div>
      {/* Posts */}
      <Posts username={username} />
    </div>
  );
};

export default ProfilePage;
