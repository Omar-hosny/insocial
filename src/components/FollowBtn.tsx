"use client";
import React from "react";
import { Button } from "./ui/button";
import { followUser } from "@/actions/user.actions";

const FollowBtn = ({ followedId }: { followedId: string }) => {
  const [isPending, setIsPending] = React.useState(false);

  const handleFollow = async () => {
    try {
      setIsPending(true);
      await followUser(followedId);
    } catch (error) {
      console.log(error);
    } finally {
      setIsPending(false);
    }
  };

  if (!followedId) return null;

  return (
    <Button onClick={handleFollow} type="submit" size="sm" disabled={isPending}>
      {isPending ? "Following..." : "Follow"}
    </Button>
  );
};

export default FollowBtn;
