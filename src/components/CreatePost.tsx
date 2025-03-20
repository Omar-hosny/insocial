"use server";
import UserAvatar from "./UserAvatar";
import CreatePostForm from "./CreatePostForm";

const CreatePost = () => {
  return (
    <div className="flex items-start flex-1 gap-2">
      <UserAvatar />
      <CreatePostForm />
    </div>
  );
};

export default CreatePost;
