import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import { useCreatePost } from "@/lib/react-query/QueriesAndMutaions";
import { PostValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Models } from "appwrite";
import { useForm, UseFormReturn } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";

type Result = {
  onSubmit: (values: z.infer<typeof PostValidation>) => Promise<void>;
  isLoadingCreate: boolean;
  form: UseFormReturn<
    {
      caption: string;
      file: File[];
      location: string;
      tags: string;
    },
    any,
    undefined
  >;
};

const useCreatePostForm = (post: Models.Document | undefined): Result => {
  const { mutateAsync: createPost, isPending: isLoadingCreate } =
    useCreatePost();
  const { user } = useUserContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post?.location : "",
      tags: post ? post?.tags.join(",") : "",
    },
  });

  async function onSubmit(values: z.infer<typeof PostValidation>) {
    const newPost = await createPost({
      ...values,
      userId: user.id,
    });

    if (!newPost) {
      toast({
        title: "Please try again",
      });
    }
    navigate("/");
  }
  return { onSubmit, isLoadingCreate, form };
};

export default useCreatePostForm;
