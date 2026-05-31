import { createBrowserRouter } from "react-router-dom";
import Root from "../layouts/Root";
import DashboardLayout from "../layouts/DashboardLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import BrowseLessons from "../pages/BrowseLessons";
import LessonDetails from "../pages/LessonDetails";
import PaymentSuccess from "../pages/PaymentSuccess";
import PaymentCancel from "../pages/PaymentCancel";
import NotFound from "../pages/NotFound";
import DashboardHome from "../pages/dashboard/DashboardHome";
import AddLesson from "../pages/dashboard/AddLesson";
import MyLessons from "../pages/dashboard/MyLessons";
import MyFavorites from "../pages/dashboard/MyFavorites";
import UpdateLesson from "../pages/dashboard/UpdateLesson";
import Upgrade from "../pages/dashboard/Upgrade";
import AdminHome from "../pages/dashboard/admin/AdminHome";
import ManageUsers from "../pages/dashboard/admin/ManageUsers";
import ManageReports from "../pages/dashboard/admin/ManageReports";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "lessons",
        element: <BrowseLessons />,
      },
      {
        path: "lessons/:id",
        element: <LessonDetails />,
      },
      {
        path: "payment/success",
        element: (
          <PrivateRoute>
            <PaymentSuccess />
          </PrivateRoute>
        ),
      },
      {
        path: "payment/cancel",
        element: (
          <PrivateRoute>
            <PaymentCancel />
          </PrivateRoute>
        ),
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
      {
        path: "add-lesson",
        element: <AddLesson />,
      },
      {
        path: "my-lessons",
        element: <MyLessons />,
      },
      {
        path: "my-favorites",
        element: <MyFavorites />,
      },
      {
        path: "update-lesson/:id",
        element: <UpdateLesson />,
      },
      {
        path: "upgrade",
        element: <Upgrade />,
      },
      /* ── Admin Routes ── */
      {
        path: "admin",
        element: (
          <AdminRoute>
            <AdminHome />
          </AdminRoute>
        ),
      },
      {
        path: "admin/users",
        element: (
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        ),
      },
      {
        path: "admin/reports",
        element: (
          <AdminRoute>
            <ManageReports />
          </AdminRoute>
        ),
      },
    ],
  },
]);

export default router;
