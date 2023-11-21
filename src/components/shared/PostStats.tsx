// import usePostStats from "@/hooks/usePostStats";
import usePostStats from "@/hooks/usePostStats";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite";
type Props = {
  post: Models.Document;
  userId: string;
};
const PostStats = ({ post, userId }: Props) => {
  const { handleLikePost, handleSavePost, isSaved, likes } = usePostStats({
    post,
    userId,
  });

  return (
    <div className="flex justify-between items-center z-20 ">
      <div className="flex gap-2 mr-5 ">
        <img
          src={
            checkIsLiked(likes, userId)
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
          }
          alt="like"
          width={20}
          height={200}
          onClick={handleLikePost}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>
      <div className="flex gap-2">
        <img
          src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
          alt="save"
          width={20}
          height={200}
          onClick={handleSavePost}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
};

export default PostStats;
