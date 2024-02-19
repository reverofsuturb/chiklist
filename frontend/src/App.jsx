import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet, createBrowserRouter, RouterProvider } from "react-router-dom";
// import LoginFormPage from './components/LoginFormPage';
// import SignupFormPage from './components/SignupFormPage';
import Navigation from "./components/Navigation/Navigation-bonus";
import * as sessionActions from "./store/session";
import { Modal } from "./context/Modal";
import Landing from "./components/Landing/Landing";
import GroupsListPage from "./components/Groups";
import GroupDetailsPage from "./components/Groups/";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GroupForm from "./components/Groups/GroupForm";
function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  const router = (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/groups" element={<GroupsListPage />} />
        <Route path="/groups/:groupId" element={<GroupDetailsPage />} />
        <Route path="/groups/new" element={<GroupForm />} />
        <Route path="/events" element={<EventsListPage />} />
        <Route path="/events/:eventId" element={<EventDetailsPage />} />
        <Route path="/events/new" element={<EventForm />} />
      </Routes>
    </BrowserRouter>
  );

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
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
