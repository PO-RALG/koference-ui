const auth = ({ to, next, store }) => {
  const loginStatus = store.getters["Auth/getLoginStatus"];
  const loggedIn = loginStatus ? loginStatus.isLoggedIn : false;
  const currentUser = store.getters["Auth/getCurrentUser"];

  const REDIRECT_URL = "/login?redirect=" + to.path;

  if (to.matched.some((record: any) => record.meta.requiresAuth)) {
    if (loggedIn && currentUser) {
      next();
    } else {
      store.dispatch("Snackbar/setSnackbar", {
        color: "error",
        text: "You must be logged in to view that page.",
      });
      next(REDIRECT_URL);
    }
  } else {
    next();
  }
};

export default auth;
