import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import { useUpdateUser } from "@/lib/react-query/QueriesAndMutaions";
import { ProfileValidation } from "@/lib/validation";
import { Models } from "appwrite";
import { useNavigate, useParams } from "react-router-dom";

const useUpdateProfile = (currentUser: Models.Document) => {
  const { user, setUser } = useUserContext();
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof ProfileValidation>>({
    resolver: zodResolver(ProfileValidation),
    defaultValues: {
      file: [],
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio || "",
    },
  });
  const { mutateAsync: updateUser, isPending: isLoadingUpdate } =
    useUpdateUser();

  const handleUpdate = async (value: z.infer<typeof ProfileValidation>) => {
    const updatedUser = await updateUser({
      userId: currentUser.$id,
      name: value.name,
      username: value.username,
      bio: value.bio,
      file: value.file,
      imageUrl: currentUser.imageUrl,
      imageId: currentUser.imageId,
    });

    if (!updatedUser) {
      toast({
        title: "Update user failed, please try again",
        variant: "destructive",
      });
    }
    setUser({
      ...user,
      name: updatedUser?.name,
      bio: updatedUser?.bio,
      imageUrl: updatedUser?.imageUrl,
    });
    return navigate(`/profile/${id}`);
  };
  return {
    form,
    handleUpdate,
    isLoadingUpdate,
  };
};

export default useUpdateProfile;
