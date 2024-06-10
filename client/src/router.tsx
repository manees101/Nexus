import { Outlet, createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import AuthLayout from "./pages/AuthLayout";
import Signup from "./pages/Signup";
import { AuthProvider } from "./context/AuthContext";
import RootLayout from "./pages/RootLayout";
import Home from "./pages/Home";
import NewChat from "./chat/NewChat";
export const router = createBrowserRouter([
  {
    element: <ContextWrapper />,
    children: [
      {
        path: "/",
        element: <RootLayout />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: "/channel",
            children: [
              {
                path: "new",
                element: <NewChat />,
              },
            ],
          },
        ],
      },
      {
        element: <AuthLayout />,
        children: [
          {
            path: "/login",
            element: <Login />,
          },
          {
            path: "/signup",
            element: <Signup />,
          },
        ],
      },
    ],
  },
]);

function ContextWrapper() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
