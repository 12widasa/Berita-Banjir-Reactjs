import { createBrowserRouter } from "react-router-dom";
import LoginScreen from "./pages/LoginScreen";
import RegisterScreen from "./pages/RegisterScreen";
import Dashboard from "./pages/Dashboard.jsx";
import CreateReport from "./pages/CreateReport";
import MainLayout from "./components/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import UserReport from "./pages/UserReport";

const RouteList = createBrowserRouter([
  {
    path: "/login",
    element: <LoginScreen />,
  },
  {
    path: "/register",
    element: <RegisterScreen />,
  },
  {
    path: "/",
    element: (
      <MainLayout>
        <Dashboard />
      </MainLayout>
    ),
  },
  {
    path: "/create-report",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <CreateReport />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/user-report",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <UserReport />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
]);

export default RouteList;
