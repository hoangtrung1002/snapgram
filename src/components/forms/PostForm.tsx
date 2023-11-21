import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import useCreatePostForm from "@/hooks/useCreatePostForm";
import { Models } from "appwrite";
import { FileUploader } from "../shared";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import Loader from "../shared/Loader";
import { TypeAction } from "@/types";

type PostFormProps = {
  post?: Models.Document;
  action: TypeAction;
};

const PostForm = ({ post, action }: PostFormProps) => {
  const { onSubmit, isLoadingCreate, form, isLoadingUpdate } =
    useCreatePostForm(post, action);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-9 w-full max-w-5xl"
      >
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  disabled={isLoadingCreate || isLoadingUpdate}
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add photos</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.imageUrl}
                  disabled={isLoadingCreate || isLoadingUpdate}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="shad-input"
                  {...field}
                  disabled={isLoadingCreate || isLoadingUpdate}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add Tag (separated by comma" , ")
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="shad-input"
                  placeholder="Travel, Books, Enjoy"
                  disabled={isLoadingCreate || isLoadingUpdate}
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end">
          <Button type="button" className="shad-button_dark_4">
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
            disabled={isLoadingCreate || isLoadingUpdate}
          >
            {isLoadingCreate || isLoadingUpdate ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              <>{action} Post</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
