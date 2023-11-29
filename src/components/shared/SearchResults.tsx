import { Models } from "appwrite";
import Loader from "./Loader";
import { GridPostList } from ".";

type SearchResultsProps = {
  isSearchFetching: boolean;
  searchedPosts?: Models.Document[];
};

const SearchResults = ({
  searchedPosts,
  isSearchFetching,
}: SearchResultsProps) => {
  console.log(searchedPosts);

  if (!isSearchFetching) {
    return <Loader />;
  } else if (searchedPosts && searchedPosts.length > 0) {
    return <GridPostList posts={searchedPosts} />;
  } else {
    return (
      <p className="text-light-4 mt-10 text-center w-full">No results found</p>
    );
  }
};

export default SearchResults;
