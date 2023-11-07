import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import {
  useCreateUserAccount,
  useSignInAccount,
} from "@/lib/react-query/QueriesAndMutaions";
import { SignUpValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";

const useSignUpForm = () => {
  const { toast } = useToast();
  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } =
    useCreateUserAccount();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const { mutateAsync: signInAccount } = useSignInAccount();
  const navigate = useNavigate();

  // 1. Define your form.
  const form = useForm<z.infer<typeof SignUpValidation>>({
    resolver: zodResolver(SignUpValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignUpValidation>) {
    const newUser = await createUserAccount(values);
    if (!newUser) {
      return toast({
        title: "Sign up failed. Please try again",
      });
    }
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });

    if (!session) {
      return toast({
        title: "Sign in failed. Please try again",
      });
    }

    const isLoggedIn = await checkAuthUser();

    if (isLoggedIn) {
      form.reset();
      navigate("/");
    } else {
      return toast({
        title: "Sign in failed. Please try again",
      });
    }
  }

  return { form, onSubmit, isCreatingAccount, isUserLoading };
};

export default useSignUpForm;
