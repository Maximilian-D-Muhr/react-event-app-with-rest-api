import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router";

import { MainLayout } from "../layouts/MainLayout";
import { RequireAuth } from "../auth/RequireAuth";
import { Home, EventDetails, SignIn, SignUp, CreateEvent, NotFound } from "../pages";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<MainLayout />}>
      <Route index element={<Home />} />
      <Route path="events/:id" element={<EventDetails />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="signin" element={<SignIn />} />

      <Route element={<RequireAuth />}>
        <Route path="create" element={<CreateEvent />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Route>
  )
);
