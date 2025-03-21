import { getCurrentUser } from "@/actions/auth.actions";
import Image from "next/image";
import Link from "next/link";

const ProfileCard = async () => {
  const user = await getCurrentUser();
  if (!user) return null;
  return (
    <div className="w-full flex flex-col items-center">
      {/* avatar */}
      <Link
        href={`/profile/${user.username}`}
        className=" rounded-full overflow-hidden"
      >
        <Image
          src={user.image || "/profile.png"}
          alt={user.name}
          width={50}
          height={50}
          className="rounded-full"
        />
      </Link>
      {/* name */}
      <div className="flex flex-col items-center gap-1">
        <Link href={`/profile/${user.username}`}>
          <p>{user.name}</p>
        </Link>
        <p>@{user.username}</p>
      </div>
      {/* bio */}
      <div className="text-center text-gray-500 text-sm mt-1">
        {user.bio || "No bio"}
      </div>
      {/* followers / following */}
      <div className="flex items-center justify-around gap-2 mt-2 w-5/6 dark:text-gray-200  text-gray-500 ">
        <p className=" text-sm">{user._count.followers} followers</p>
        <p className=" text-sm">{user._count.following} following</p>
      </div>
    </div>
  );
};

export default ProfileCard;
