import { useUserContext } from "@/context/AuthContext";
import { useGetUsers } from "@/lib/react-query/QueriesAndMutaions";
import { UserCard } from ".";
import { useToast } from "../ui/use-toast";
import Loader from "./Loader";

const AllUsers = () => {
  const { user } = useUserContext();
  const { toast } = useToast();
  const {
    data: creators,
    isLoading,
    isError: isErrorCreators,
  } = useGetUsers(user?.id || "");

  if (isErrorCreators) {
    toast({
      title: "Something went wrong",
    });
  }

  return (
    <div className="common-container">
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">
          {isLoading && !creators ? (
            <Loader />
          ) : (
            <ul className="user-grid">
              {creators?.documents.map((creator) => (
                <li key={creator.$id} className="flex-1 min-w-[200px] w-full">
                  <UserCard user={creator} />
                </li>
              ))}
            </ul>
          )}
        </h2>
      </div>
    </div>
  );
};

export default AllUsers;
