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
    component: Profile
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

export default router;
