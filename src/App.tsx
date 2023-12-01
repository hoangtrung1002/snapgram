import { Toaster } from "@/components/ui/toaster";
import { Route, Routes } from "react-router-dom";
import AuthLayout from "./_auth/AuthLayout";
import { SignInForm, SignUpForm } from "./_auth/form";
import RootLayout from "./_root/RootLayout";
import { Home } from "./_root/pages";

import {
  AllUsers,
  CreatePost,
  EditPost,
  Explore,
  PageNotFound,
  PostDetails,
  Profile,
  Saved,
  UpdateProfile,
} from "./components/shared";
import "./globals.css";

const App = () => {
  return (
    <main className="flex h-screen">
      <Routes>
        {/* Public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SignInForm />} />
          <Route path="/sign-up" element={<SignUpForm />} />
        </Route>
        {/* Private routes */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/all-user" element={<AllUsers />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:id" element={<EditPost />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/profile/:id/*" element={<Profile />} />
          <Route path="/update-profile/:id" element={<UpdateProfile />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
      <Toaster />
    </main>
  );
};

export default App;
