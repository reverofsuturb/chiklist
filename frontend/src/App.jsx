import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet, createBrowserRouter, RouterProvider } from "react-router-dom";
// import LoginFormPage from './components/LoginFormPage';
// import SignupFormPage from './components/SignupFormPage';
import * as sessionActions from "./store/session";

import Navigation from "./components/Navigation/Navigation-bonus";
import { Modal } from "./context/Modal";
import { Landing } from "./components/Landing/";

import {
  GroupDetailsPage,
  GroupEventsListPage,
  GroupsListPage,
  CreateGroup,
  EditGroup,
  UserGroupsListPage,
} from "./components/Groups";

import {
  EventDetailsPage,
  EventsListPage,
  EventForm,
  UserEventsListPage,
} from "./components/Events";

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  return (
    <>
      <Modal />
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Landing />,
      },
      // {
      //   path: 'login',
      //   element: <LoginFormPage />
      // },
      // {
      //   path: 'signup',
      //   element: <SignupFormPage />
      // }
      {
        path: "/groups",
        element: <GroupsListPage />,
      },
      { path: "/groups/current", element: <UserGroupsListPage /> },
      { path: "/groups/new", element: <CreateGroup /> },
      { path: "/groups/:groupId/events", element: <GroupEventsListPage /> },
      { path: "/groups/:groupId/events/new", element: <EventForm /> },
      { path: "/groups/:groupId/edit", element: <EditGroup /> },
      { path: "/groups/:groupId", element: <GroupDetailsPage /> },
      { path: "/events/current", element: <UserEventsListPage /> },
      { path: "/events", element: <EventsListPage /> },
      { path: "/events/:eventId", element: <EventDetailsPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
