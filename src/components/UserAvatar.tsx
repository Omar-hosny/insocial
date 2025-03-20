import { getCurrentUser } from "@/actions/auth.actions";
import Image from "next/image";
import React from "react";

const UserAvatar = async () => {
  const user = await getCurrentUser();
  if (!user) return null;
  return (
    <div className="flex items-center justify-center overflow-hidden">
      <Image
        src={user.image || "/profile.png"}
        alt={user.name || ""}
        width={47}
        height={47}
        className="rounded-full"
      />
    </div>
  );
};

export default UserAvatar;
