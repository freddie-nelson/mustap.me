import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home/Home";
import Library from "../views/Library/Library";
import LibraryPlaylists from "../views/Library/components/LibraryPlaylists";
import LibrarySongs from "../views/Library/components/LibrarySongs";
import Themes from "../views/Themes/Themes";
import MyThemes from "../views/Themes/views/MyThemes";
import AllThemes from "../views/Themes/views/AllThemes";
import CreateTheme from "../views/Themes/views/CreateTheme"
import Profile from "../views/Profile/Profile";
import SignInForm from "../views/Profile/components/SignInForm";
import MyProfile from "../views/Profile/components/MyProfile";
import Settings from "../views/Settings/Settings";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/Library", 
    component: Library,
    children: [
      {
        path: "/",
        name: "Library",
        component: LibraryPlaylists
      },
      {
        path: "/Library/:playlistName",
        name: "LibraryPlaylist",
        component: LibrarySongs,
        props: true
      }
    ]
  },
  {
    path: "/Themes",
    component: Themes,
    children: [
      {
        path: "/",
        name: "Themes",
        component: MyThemes
      },
      {
        path: "/Themes/AllThemes",
        name: "AllThemes",
        component: AllThemes
      },
      {
        path: "/Themes/CreateTheme",
        name: "CreateTheme",
        component: CreateTheme
      }
    ]
  },
  {
    path: "/Profile",
    name: "Profile",
    component: Profile,
    children: [
      {
        path: "/SignIn",
        name: "SignIn",
        component: SignInForm
      },
      {
        path: "/MyProfile",
        name: "MyProfile",
        component: MyProfile
      }
    ]
  },
  {
    path: "/Settings",
    name: "Settings",
    component: Settings
  }
];

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  if (from.name === "LibraryPlaylist" && to.name !== "Library") {
    router.replace({ name: "Library", query: { goto: to.name } });
  } else {
    next();
  }
});

export default router;
