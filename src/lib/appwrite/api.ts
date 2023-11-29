import { INewPost, INewUser, IUpdatePost } from "@/types";
import { ID, Query } from "appwrite";
import { account, appwriteConfig, avatars, database, storage } from "./config";

export const createUserAccount = async (user: INewUser) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(newAccount.name);

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      imageUrl: avatarUrl,
      username: user.username,
    });

    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const saveUserToDB = async (user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: URL;
  username?: string;
}) => {
  try {
    const newUser = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );
    return newUser;
  } catch (error) {
    console.log(error);
  }
};

export const signInAccount = async (user: {
  email: string;
  password: string;
}) => {
  try {
    const session = await account.createEmailSession(user.email, user.password);
    return session;
  } catch (error) {
    console.log(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;

    const currentUser = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
};

export const signOutAccount = async () => {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    console.log(error);
  }
};

export const createPost = async (post: INewPost) => {
  try {
    // upload image to storage
    const uploadedFile = await uploadFile(post.file[0]);
    if (!uploadedFile) throw new Error();

    // Get file url
    const fileUrl = await getFilePreview(uploadedFile.$id);
    if (!fileUrl) {
      deleteFile(uploadedFile.$id);
      throw new Error();
    }
    //  Convert tags in an array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Save a new post to database
    const newPost = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags,
      }
    );
    if (!newPost) {
      deleteFile(uploadedFile.$id);
      throw new Error();
    }
    return newPost;
  } catch (error) {
    console.log(error);
  }
};

export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );

    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
}

export const getFilePreview = (fileId: string) => {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      1440,
      1880,
      "top",
      100
    );
    return fileUrl;
  } catch (error) {
    console.log(error);
  }
};

export const deleteFile = async (fileId: string) => {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);
    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
};

export const getRecentPosts = async () => {
  const posts = await database.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    [Query.orderDesc("$createdAt"), Query.limit(20)]
  );

  if (!posts) throw new Error();

  return posts;
};

export const likePost = async (postId: string, likesArray: string[]) => {
  try {
    const updatedPost = await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      { likes: likesArray }
    );

    if (!updatedPost) throw Error();

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
};

export const savePost = async (postId: string, userId: string) => {
  try {
    const savedPost = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      { users: userId, post: postId }
    );

    if (!savedPost) throw Error();

    return savedPost;
  } catch (error) {
    console.log(error);
  }
};

export async function deleteSavedPost(savedRecordId: string) {
  try {
    const statusCode = await database.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId
    );

    if (!statusCode) throw Error;

    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}

export const getPostById = async (postId?: string) => {
  if (!postId) throw Error();
  try {
    const post = await database.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    if (!post) throw Error();

    return post;
  } catch (error) {
    console.log(error);
  }
};

export const updatePost = async (post: IUpdatePost) => {
  const hasFileToUpdate = post.file.length > 0;
  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };

    if (hasFileToUpdate) {
      // upload image to storage
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw new Error();
      // Get file url
      const fileUrl = await getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        deleteFile(uploadedFile.$id);
        throw new Error();
      }
      image = { ...image, imageId: uploadedFile.$id, imageUrl: fileUrl };
    }

    //  Convert tags in an array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Save a new post to database
    const updatedPost = await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags,
      }
    );
    if (!updatedPost) {
      deleteFile(image.imageId);
      throw new Error();
    }
    return updatedPost;
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = async (postId: string, imageId: string) => {
  if (!postId || !imageId) throw Error;
  try {
    await database.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
};

export const getInfinitePosts = async ({
  pageParam,
}: {
  pageParam: number;
}) => {
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(10)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString())); //offset
  }
  try {
    const posts = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
};

export async function searchPosts(searchTerm: string) {
  try {
    const allPosts = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId
    );

    if (!allPosts) throw Error;

    const posts = allPosts.documents.filter((post) =>
      post.tags.includes(searchTerm)
    );

    return posts;
  } catch (error) {
    console.log(error);
  }
}
