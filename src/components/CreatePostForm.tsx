"use client";
import React, { useActionState, useRef, useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Image as ImageIcon, X } from "lucide-react";
// import Image from "next/image";
import { createPost } from "@/actions/post.actions";
import Image from "next/image";

const CreatePostForm = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [state, createPostAction, isPending] = useActionState(createPost, {
    errors: {},
    prevData: {},
  });

  const handleFileButtonClick = () => {
    // Trigger the hidden file input click event
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    const urlImage = URL.createObjectURL(file);
    setImagePreview(urlImage);
    setSelectedFile(file);
  };

  const clearSelectedImage = () => {
    setImagePreview(null);
    setSelectedFile(null);
  };

  return (
    <form action={createPostAction} className="flex-1 flex flex-col gap-2">
      <Textarea
        id="content"
        name="content"
        placeholder="What's on your mind?"
        rows={5}
        maxLength={280}
      ></Textarea>
      {state?.errors?.content && (
        <p className="text-red-500 text-sm">{state.errors.content}</p>
      )}
      <div className="flex-1 flex items-center justify-between">
        <>
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            name="image"
            accept="image/*"
            className="hidden"
          />
          <Button
            size="icon"
            variant="outline"
            type="button"
            onClick={handleFileButtonClick}
          >
            <ImageIcon size={21} />
          </Button>
        </>
        <Button
          disabled={isPending}
          variant="secondary"
          type="submit"
          size="sm"
        >
          {isPending ? "Posting..." : "Create Post"}
        </Button>
      </div>
      {selectedFile && imagePreview && (
        <div className=" relative flex flex-col p-2 items-start border border-gray-100 rounded-2xl">
          <Button
            onClick={clearSelectedImage}
            size="icon"
            variant="secondary"
            className=" rounded-2xl  absolute top-1 right-1 "
          >
            <X size={20} />
          </Button>
          <Image
            src={imagePreview}
            alt="Preview"
            className=" object-cover rounded-2xl "
            width={70}
            height={70}
          />
          <span className="text-sm text-gray-600 mt-1">
            {selectedFile.name}
          </span>
        </div>
      )}
    </form>
  );
};

export default CreatePostForm;
