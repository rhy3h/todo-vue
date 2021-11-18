import App from "../App";
import About from "../components/maketing/About";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import Logout from "../components/auth/Logout";
import LandingPage from "../components/maketing/LandingPage";

const routes = [
  {
    path: "/",
    name: "home",
    component: LandingPage,
  },
  {
    path: "/todo",
    name: "todo",
    component: App,
    meta: {
      requireAuth: true,
    },
  },
  {
    path: "/about",
    name: "about",
    component: About,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    props: true,
    meta: {
      requireVisitor: true,
    },
  },
  {
    path: "/register",
    name: "register",
    component: Register,
    meta: {
      requireVisitor: true,
    },
  },
  {
    path: "/logout",
    name: "logout",
    component: Logout,
  },
];

export default routes;
