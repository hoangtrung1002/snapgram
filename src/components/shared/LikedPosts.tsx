import { useGetCurrentUser } from "@/lib/react-query/QueriesAndMutaions";
import Loader from "./Loader";
import { GridPostList } from ".";

const LikedPosts = () => {
  const { data: currentUser } = useGetCurrentUser();

  if (!currentUser) return <Loader />;

  const likedPosts = currentUser.liked;

  return (
    <>
      {likedPosts.length === 0 ? (
        <p className="text-light-4">No available posts</p>
      ) : (
        <GridPostList posts={likedPosts} showStats={false} />
      )}
    </>
  );
};

export default LikedPosts;
