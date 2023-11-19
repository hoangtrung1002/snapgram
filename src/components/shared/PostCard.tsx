import { useUserContext } from "@/context/AuthContext";
import { multiFormatDateString } from "@/lib/utils";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";

type PostCardProps = {
  post: Models.Document;
};
const PostCard = ({ post }: PostCardProps) => {
  const { user } = useUserContext();

  if (!post.creator) return;

  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.creator.$id}`}>
            <img
              src={
                post.creator.imageUrl || "/assets/icons/profile-placeholder.svg"
              }
              alt="creator"
              className="rounded-full w-8 lg:h-8"
            />
          </Link>
          <div className="flex flex-col">
            <div className="flex gap-3 items-baseline">
              <p className="small-semibold text-light-1">{post.creator.name}</p>
              <div className="small-medium gap-2 text-light-3">
                <p>{multiFormatDateString(post.$createdAt)}</p>
              </div>
            </div>
            <p className="small-medium gap-2 text-light-3">{post.location}</p>
          </div>
        </div>
        <Link
          to={`update-post/${post.$id}`}
          className={`${user.id !== post.creator.$id && "hidden"}`}
        >
          <img
            src="/assets/icons/edit.svg"
            alt="edit post"
            width={20}
            height={20}
          />
        </Link>
      </div>

      <Link to={`/posts/${post.$id}`}>
        <img
          src={post.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="post image"
          className="post-card_img mt-2"
        />
        <div className="small-medium lg:base-medium py-5">
          <p>{post.caption}</p>
          <ul className="flex gap-1 mt-2">
            {post.tags.map((tag: string) => (
              <li key={tag} className="text-light-3">
                #{tag}
              </li>
            ))}
          </ul>
        </div>
      </Link>
      <PostStats post={post} userId={user.id} />
    </div>
  );
};

export default PostCard;
