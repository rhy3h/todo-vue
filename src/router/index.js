import { createRouter, createWebHistory } from "vue-router";
//import { getAuth } from "firebase/auth";

import routes from "./routes";

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requireAuth)) {
    if (!localStorage.getItem("accessToken")) {
      next({
        name: "login",
      });
    } else {
      next();
    }
  } else if (to.matched.some((record) => record.meta.requireVisitor)) {
    if (localStorage.getItem("accessToken")) {
      next({
        name: "todo",
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
