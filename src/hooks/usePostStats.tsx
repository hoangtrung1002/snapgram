import {
  useDeleteSavedPost,
  useGetCurrentUser,
  useLikePost,
  useSavePost,
} from "@/lib/react-query/QueriesAndMutaions";
import { Models } from "appwrite";
import React, { useEffect, useState } from "react";

type Props = {
  post: Models.Document;
  userId: string;
};

const usePostStats = ({ post, userId }: Props) => {
  const likesList = post.likes.map((user: Models.Document) => user.$id);

  const [likes, setLikes] = useState<string[]>(likesList);
  const [isSaved, setIsSaved] = useState(false);

  const { mutate: likePost } = useLikePost();
  const { mutate: savePost } = useSavePost();
  const { mutate: deleteSavePost } = useDeleteSavedPost();

  const { data: currentUser } = useGetCurrentUser();

  const savedPostRecord = currentUser?.save.find(
    (record: Models.Document) => record.post.$id === post.$id
  );

  useEffect(() => {
    setIsSaved(!!savedPostRecord);
  }, [currentUser]);

  const handleLikePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    let likesArray = [...likes];

    if (likesArray.includes(userId)) {
      likesArray = likesArray.filter((Id) => Id !== userId);
    } else {
      likesArray.push(userId);
    }

    setLikes(likesArray);
    likePost({ postId: post.$id, likesArray });
  };

  //   !Error: Fix feature save
  const handleSavePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    if (savedPostRecord) {
      setIsSaved(false);
      deleteSavePost(savedPostRecord.$id);
    }

    savePost({ userId: userId, postId: post.$id });
    setIsSaved(true);
  };

  return {
    handleLikePost,
    handleSavePost,
    isSaved,
    likes,
  };
};

export default usePostStats;
