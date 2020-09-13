<template>
  <nav
    class="nav"
    :class="{ small: smallNavbar }"
  >
    <!-- <div
      class="border"
      @click="() => { $store.dispatch('navbarChanged', !smallNavbar); smallNavbar = !smallNavbar; }"
    />
    <div class="nav__resize-btn">
      <img
        src="@/assets/svg/chevron-down.svg"
        alt="Resize Navbar"
        :style="{ filter: $store.getters.imageFilter }"
      >
    </div>
    <div class="nav__logo">
      <h1>Mustap</h1>
      <svg
        width="300"
        height="137"
        viewBox="0 0 300 137"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M206 132.238C234 142.751 262 134.341 290 121.724L296.5 118L303 112.5L300 0H-2.09808e-05C-22.1827 56.6857 -49.3869 105.157 38 98.5946C66 96.4919 94 79.6703 122 85.9784C150 92.2865 178 121.724 206 132.238Z"
        />
      </svg>
    </div> -->

    <div class="nav__links-container">
      <!-- <svg id="svg-defs">
        <defs>
          <linearGradient
            id="selectedGradient"
            x2="0%"
            y2="100%"
          >
            <stop
              offset="0%"
              stop-color="#E91E63"
            />
            <stop
              offset="100%"
              stop-color="#E91EA4"
            />
          </linearGradient>
        </defs>
      </svg> -->

      <router-link
        class="nav__links-link"
        :class="{ selected: this.$route.name === 'Home' }"
        to="/"
      >
        <!-- <svg
          width="41"
          height="39"
          viewBox="0 0 41 39"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M39.5942 19.1924L22.6138 2.22072L21.4756 1.08254C21.2162 0.824916 20.8655 0.680328 20.5 0.680328C20.1345 0.680328 19.7837 0.824916 19.5244 1.08254L1.40576 19.1924C1.14003 19.4571 0.930015 19.7723 0.788119 20.1195C0.646222 20.4667 0.575317 20.8388 0.579589 21.2139C0.597167 22.7608 1.88476 23.9956 3.43164 23.9956H5.29932V38.3086H35.7007V23.9956H37.6079C38.3594 23.9956 39.0669 23.7012 39.5986 23.1695C39.8605 22.9085 40.0679 22.5981 40.209 22.2564C40.35 21.9147 40.4219 21.5484 40.4204 21.1787C40.4204 20.4317 40.126 19.7241 39.5942 19.1924ZM22.9609 35.1445H18.0391V26.1797H22.9609V35.1445ZM32.5366 20.8316V35.1445H25.7734V25.125C25.7734 24.1538 24.9868 23.3672 24.0156 23.3672H16.9844C16.0132 23.3672 15.2266 24.1538 15.2266 25.125V35.1445H8.46338V20.8316H4.24463L20.5044 4.58498L21.5195 5.60012L36.7598 20.8316H32.5366Z"
          />
        </svg> -->
        <v-icon name="home" />
        <h2>Home</h2>
      </router-link>

      <router-link
        class="nav__links-link"
        :class="{ selected: this.$route.name === 'Library' || this.$route.name === 'LibraryPlaylist' }"
        to="/Library"
      >
        <!-- <svg
          width="39"
          height="39"
          viewBox="0 0 39 39"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.5 8.25H0.75V34.5C0.75 35.4946 1.14509 36.4484 1.84835 37.1517C2.55161 37.8549 3.50544 38.25 4.5 38.25H30.75V34.5H4.5V8.25ZM30.75 10.125H25.125V20.4375C25.125 21.6807 24.6311 22.873 23.7521 23.7521C22.873 24.6311 21.6807 25.125 20.4375 25.125C19.1943 25.125 18.002 24.6311 17.1229 23.7521C16.2439 22.873 15.75 21.6807 15.75 20.4375C15.75 19.1943 16.2439 18.002 17.1229 17.1229C18.002 16.2439 19.1943 15.75 20.4375 15.75C21.5063 15.75 22.4625 16.1063 23.25 16.6875V6.375H30.75V10.125ZM34.5 0.75H12C11.0054 0.75 10.0516 1.14509 9.34835 1.84835C8.64509 2.55161 8.25 3.50544 8.25 4.5V27C8.25 27.9946 8.64509 28.9484 9.34835 29.6517C10.0516 30.3549 11.0054 30.75 12 30.75H34.5C35.4946 30.75 36.4484 30.3549 37.1517 29.6517C37.8549 28.9484 38.25 27.9946 38.25 27V4.5C38.25 3.50544 37.8549 2.55161 37.1517 1.84835C36.4484 1.14509 35.4946 0.75 34.5 0.75Z"
          />
        </svg> -->
        <v-icon name="music" />
        <h2>Library</h2>
      </router-link>

      <router-link
        class="nav__links-link"
        :class="{ selected: this.$route.name === 'Themes' || this.$route.name === 'AllThemes' || this.$route.name === 'CreateTheme' }"
        to="/Themes"
      >
        <!-- <svg
          width="39"
          height="39"
          viewBox="0 0 39 39"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.5 8.25C3.50544 8.25 2.55161 8.64509 1.84835 9.34835C1.14509 10.0516 0.75 11.0054 0.75 12V34.5C0.75 36.5625 2.4375 38.25 4.5 38.25H27C27.9946 38.25 28.9484 37.8549 29.6517 37.1517C30.3549 36.4484 30.75 35.4946 30.75 34.5H4.5V8.25ZM34.5 0.75H12C11.0054 0.75 10.0516 1.14509 9.34835 1.84835C8.64509 2.55161 8.25 3.50544 8.25 4.5V27C8.25 27.9946 8.64509 28.9484 9.34835 29.6517C10.0516 30.3549 11.0054 30.75 12 30.75H34.5C35.4946 30.75 36.4484 30.3549 37.1517 29.6517C37.8549 28.9484 38.25 27.9946 38.25 27V4.5C38.25 3.50544 37.8549 2.55161 37.1517 1.84835C36.4484 1.14509 35.4946 0.75 34.5 0.75ZM25.125 27H12V13.875H25.125V27ZM34.5 27H28.875V13.875H34.5V27ZM34.5 10.125H12V4.5H34.5V10.125Z"
          />
        </svg> -->
        <v-icon name="layout" />
        <h2>Themes</h2>
      </router-link>

      <router-link
        class="nav__links-link"
        :class="{ selected: this.$route.name === 'Profile' || this.$route.name === 'SignIn' || this.$route.name === 'MyProfile' }"
        to="/Profile"
      >
        <!-- <svg
          width="39"
          height="39"
          viewBox="0 0 39 39"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19.5 0.75C9.15 0.75 0.75 9.15 0.75 19.5C0.75 29.85 9.15 38.25 19.5 38.25C29.85 38.25 38.25 29.85 38.25 19.5C38.25 9.15 29.85 0.75 19.5 0.75ZM19.5 6.375C22.6125 6.375 25.125 8.8875 25.125 12C25.125 15.1125 22.6125 17.625 19.5 17.625C16.3875 17.625 13.875 15.1125 13.875 12C13.875 8.8875 16.3875 6.375 19.5 6.375ZM19.5 33C17.2722 33 15.0791 32.4487 13.1161 31.3953C11.1532 30.3418 9.48146 28.819 8.25 26.9625C8.30625 23.2313 15.75 21.1875 19.5 21.1875C23.2313 21.1875 30.6938 23.2313 30.75 26.9625C29.5185 28.819 27.8468 30.3418 25.8839 31.3953C23.9209 32.4487 21.7278 33 19.5 33Z"
          />
        </svg> -->
        <v-icon name="user" />
        <h2>Profile</h2>
      </router-link>

      <router-link
        class="nav__links-link"
        :class="{ selected: this.$route.name === 'Settings' }"
        id="Settings"
        to="/Settings"
      >
        <!-- <svg
          width="45"
          height="45"
          viewBox="0 0 45 45"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.5 28.125C25.6066 28.125 28.125 25.6066 28.125 22.5C28.125 19.3934 25.6066 16.875 22.5 16.875C19.3934 16.875 16.875 19.3934 16.875 22.5C16.875 25.6066 19.3934 28.125 22.5 28.125Z"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M36.375 28.125C36.1254 28.6905 36.0509 29.3179 36.1612 29.9261C36.2715 30.5343 36.5615 31.0956 36.9937 31.5375L37.1062 31.65C37.4549 31.9983 37.7315 32.4118 37.9202 32.8671C38.1089 33.3223 38.2061 33.8103 38.2061 34.3031C38.2061 34.7959 38.1089 35.2839 37.9202 35.7391C37.7315 36.1944 37.4549 36.608 37.1062 36.9562C36.758 37.3049 36.3444 37.5815 35.8891 37.7702C35.4339 37.9589 34.9459 38.0561 34.4531 38.0561C33.9603 38.0561 33.4723 37.9589 33.0171 37.7702C32.5619 37.5815 32.1483 37.3049 31.8 36.9562L31.6875 36.8437C31.2456 36.4115 30.6843 36.1215 30.0761 36.0112C29.4679 35.9009 28.8405 35.9754 28.275 36.225C27.7204 36.4627 27.2475 36.8573 26.9143 37.3604C26.5812 37.8634 26.4024 38.4529 26.4 39.0562V39.375C26.4 40.3696 26.0049 41.3234 25.3016 42.0266C24.5984 42.7299 23.6446 43.125 22.65 43.125C21.6554 43.125 20.7016 42.7299 19.9983 42.0266C19.2951 41.3234 18.9 40.3696 18.9 39.375V39.2062C18.8855 38.5856 18.6846 37.9837 18.3235 37.4788C17.9623 36.9739 17.4576 36.5893 16.875 36.375C16.3095 36.1254 15.6821 36.0509 15.0739 36.1612C14.4657 36.2715 13.9044 36.5615 13.4625 36.9937L13.35 37.1062C13.0017 37.4549 12.5881 37.7315 12.1329 37.9202C11.6777 38.1089 11.1897 38.2061 10.6969 38.2061C10.2041 38.2061 9.71609 38.1089 9.26085 37.9202C8.8056 37.7315 8.39202 37.4549 8.04375 37.1062C7.69509 36.758 7.41849 36.3444 7.22977 35.8891C7.04106 35.4339 6.94392 34.9459 6.94392 34.4531C6.94392 33.9603 7.04106 33.4723 7.22977 33.0171C7.41849 32.5618 7.69509 32.1483 8.04375 31.8L8.15625 31.6875C8.58851 31.2456 8.87847 30.6843 8.98876 30.0761C9.09904 29.4679 9.02459 28.8405 8.775 28.275C8.53732 27.7204 8.14267 27.2475 7.63962 26.9143C7.13658 26.5812 6.5471 26.4024 5.94375 26.4H5.625C4.63044 26.4 3.67661 26.0049 2.97335 25.3016C2.27009 24.5984 1.875 23.6446 1.875 22.65C1.875 21.6554 2.27009 20.7016 2.97335 19.9983C3.67661 19.2951 4.63044 18.9 5.625 18.9H5.79375C6.41436 18.8855 7.01626 18.6846 7.52118 18.3235C8.02611 17.9623 8.41072 17.4576 8.625 16.875C8.87459 16.3095 8.94904 15.6821 8.83876 15.0739C8.72847 14.4657 8.43851 13.9044 8.00625 13.4625L7.89375 13.35C7.54509 13.0017 7.26849 12.5881 7.07978 12.1329C6.89106 11.6777 6.79392 11.1897 6.79392 10.6969C6.79392 10.2041 6.89106 9.71609 7.07978 9.26085C7.26849 8.8056 7.54509 8.39202 7.89375 8.04375C8.24202 7.69509 8.6556 7.41849 9.11085 7.22977C9.56609 7.04106 10.0541 6.94392 10.5469 6.94392C11.0397 6.94392 11.5277 7.04106 11.9829 7.22977C12.4381 7.41849 12.8517 7.69509 13.2 8.04375L13.3125 8.15625C13.7544 8.5885 14.3157 8.87847 14.9239 8.98876C15.5321 9.09904 16.1595 9.02459 16.725 8.775H16.875C17.4296 8.53732 17.9025 8.14266 18.2357 7.63962C18.5688 7.13658 18.7476 6.5471 18.75 5.94375V5.625C18.75 4.63044 19.1451 3.67661 19.8483 2.97335C20.5516 2.27009 21.5054 1.875 22.5 1.875C23.4946 1.875 24.4484 2.27009 25.1516 2.97335C25.8549 3.67661 26.25 4.63044 26.25 5.625V5.79375C26.2524 6.3971 26.4312 6.98658 26.7643 7.48962C27.0975 7.99267 27.5704 8.38732 28.125 8.625C28.6905 8.87459 29.3179 8.94904 29.9261 8.83876C30.5343 8.72847 31.0956 8.4385 31.5375 8.00625L31.65 7.89375C31.9983 7.54509 32.4119 7.26849 32.8671 7.07977C33.3223 6.89106 33.8103 6.79392 34.3031 6.79392C34.7959 6.79392 35.2839 6.89106 35.7391 7.07977C36.1944 7.26849 36.608 7.54509 36.9562 7.89375C37.3049 8.24202 37.5815 8.6556 37.7702 9.11085C37.9589 9.56609 38.0561 10.0541 38.0561 10.5469C38.0561 11.0397 37.9589 11.5277 37.7702 11.9829C37.5815 12.4381 37.3049 12.8517 36.9562 13.2L36.8437 13.3125C36.4115 13.7544 36.1215 14.3157 36.0112 14.9239C35.9009 15.5321 35.9754 16.1595 36.225 16.725V16.875C36.4627 17.4296 36.8573 17.9025 37.3604 18.2357C37.8634 18.5688 38.4529 18.7476 39.0562 18.75H39.375C40.3696 18.75 41.3234 19.1451 42.0266 19.8483C42.7299 20.5516 43.125 21.5054 43.125 22.5C43.125 23.4946 42.7299 24.4484 42.0266 25.1516C41.3234 25.8549 40.3696 26.25 39.375 26.25H39.2062C38.6029 26.2524 38.0134 26.4312 37.5104 26.7643C37.0073 27.0975 36.6127 27.5704 36.375 28.125V28.125Z"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg> -->
        <v-icon name="settings" />
        <h2>Settings</h2>
      </router-link>
    </div>

    <!-- <div class="nav__music-controller">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="300"
        height="234"
        viewBox="0 0 300 234"
        fill="none"
      >
        <path
          d="M0 234H300V90V36L288 39C275 42 250 48 225 47C200 45 175 36 150 27C125 18 100 9 75 5C50 0 25 0 13 0H0V90V234Z"
          fill="#242424"
        />
      </svg>

      <div class="nav__music-controller__album-details">
        <div
          class="image"
          :style="{
            backgroundImage: `url(${this.$store.state.currentPlaying.thumbnail})`
          }"
          alt="Album Cover / Song Art"
        />
        <div>
          <p>{{ this.$store.state.currentPlaying.title }}</p>
          <p>{{ this.$store.state.currentPlaying.artist }}</p>
          <p>
            {{ this.$store.state.currentPlaying.currentTime }} /
            {{ this.$store.state.currentPlaying.duration }}
          </p>
        </div>
      </div>

      <TrackControls
        ref="trackControls"
        class="nav__music-controller__controls"
        :current-time="$store.state.currentPlaying.currentTimeSeconds"
        :padding="20"
        :bg-color="'--main-bg'"
      />
    </div> -->
  </nav>
</template>

<script>
// import TrackControls from "@/components/TrackControls";
// import { debounce } from "throttle-debounce";

export default {
  name: "Navbar",
  // components: {
  //   TrackControls
  // },
  data() {
    return {
      showVolumeControls: false,
      smallNavbar: true
    };
  },
  // methods: {
  //   changeView(e) {
  //     console.log(e);
  //     const nodeName = e.target.nodeName;
  //     let id;

  //     if (nodeName === "H2" || nodeName === "svg") {
  //       id = e.srcElement.parentElement.id;
  //     } else if (nodeName === "path") {
  //       e.srcElement.parentElement.parentElement.id;
  //     } else {
  //       id = e.target.id;
  //     }

  //     if (this.$route.name === id) {
  //       return;
  //     } else {
  //       this.$router.push({ name: id });
  //     }
  //   }
  // },
};
</script>

<style lang="scss">
#svg-defs {
  position: absolute;
  width: 0;
  height: 0;
}

.nav {
  display: flex;
  flex-direction: column;
  width: 15.6vw;
  min-width: 300px;
  max-width: 300px;
  height: calc(100vh - 40px);
  background-color: var(--dark-bg);
  transition: max-width .2s ease, min-width .2s ease;
  z-index: 100;
  overflow: hidden;

  .border {
    position: absolute;
    height: 100%;
    width: 10px;
    left: 290px;
    cursor: col-resize;
  }

  &__resize-btn {
    display: none !important;
    width: 26px;
    height: 50px;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--alert-hover-color);
    top: calc(50% - 25px);
    right: -26px;
    border-radius: 0 5px 5px 0;
    cursor: pointer;
    
    img {
      width: 60%;
      margin-left: -2px;
      transform-origin: center;
      transform: rotate(90deg);
    }
  }

  &.small {
    min-width: 60px;
    max-width: 60px;
    position: relative;

    &:hover {
      &::after {
        opacity: 1;
      }

      .nav__links-link {
        opacity: 1 !important;
      }
    }

    .border {
      width: 10px;
      position: absolute;
      height: 100%;
      right: -1px;
      left: auto;
      z-index: 2;
    }

    .nav__music-controller {
      opacity: 0;
    }

    .nav__logo {
      opacity: 0;
    }

    h2 {
      display: none;
    }

    svg {
      margin-right: 0;
    }

    .nav__links-container {
      --icon-size: 28px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 0;
      height: 320px;
      width: var(--icon-size);
      position: absolute;
      margin: auto;
      right: 0;
      left: 0;
      top: 0;
      bottom: 0;
      z-index: 3;
      
      .nav__links-link {
        opacity: 0.4;
        transition: opacity .2s ease-in;
        width: var(--icon-size);

        &.selected {
          opacity: 1;
        }
      }
    }
  }

  &__logo {
    width: 100%;
    position: relative;
    transition: opacity .2s ease;
    
    svg {
      z-index: 0;
      display: block;
      height: auto;
      top: 0;

      path {
        fill: var(--navbar-logo-bg);
      }
    }

    h1 {
      position: absolute;
      color: var(--dark-bg);
      font-size: 42px;
      margin-left: 20px;
      line-height: 36px;
      margin-top: 26px;

      &::after {
        content: "";
        width: 9px;
        height: 9px;
        right: -10px;
        bottom: 3px;
        border-radius: 5px;
        background-color: var(--dark-bg);
        position: absolute;
      }
    }
  }

  &__links {
    width: 100%;
    padding: 25px;

    &-container {
      padding: 25px;
    }

    &-link {
      display: flex;
      align-items: center;
      margin-top: 30px;
      color: var(--icon-color);
      text-decoration: none;
      cursor: pointer;
      outline: none !important;

      svg {
        width: 100%;
        height: 100%;
        margin-right: 15px;
        transition: transform 0.2s ease-in;
      }

      svg * {
        stroke: var(--icon-color);
        transition: fill 0.2s ease-in, stroke 0.2s ease-in;
      }

      &:hover {
        svg {
          transform-origin: center;
          transform: rotate(-15deg);
        }
      }

      h2 {
        margin-top: 5px;
        display: inline-block;
        font-weight: 500;
        font-size: 26px;
        line-height: 20px;
      }

      &:first-of-type {
        margin-top: 0px;
      }

      &.selected {
        svg > * {
          stroke: var(--accent-color);
        }

        // svg {
        //   filter: drop-shadow(0px 0px 15px var(--accent-color));
        // }

        &#Settings svg > * {
          fill: none;
          stroke: var(--accent-color);
        }
      }
    }
  }

  &__music-controller {
    position: relative;
    height: 234px;
    width: 300px;
    margin-top: auto;
    transition: opacity .2s ease;

    > svg {
      width: 100%;
      height: auto;
      overflow: hidden;

      path {
        fill: var(--lighter-bg);
      }
    }

    &__album-details {
      display: flex;
      position: absolute;
      height: 70px;
      top: 60px;
      color: var(--primary-text);
      margin-left: 10px;

      .image {
        width: 70px;
        height: 70px;
        background-size: 240%;
        background-position: center;
        border-radius: 8px;
        background-color: var(--main-bg);
      }

      div {
        display: flex;
        flex-direction: column;
        margin-left: 10px;
        align-self: center;

        p {
          margin-top: 5px;
          line-height: 14px;
          font-size: 14px;
          font-weight: 400;
          opacity: 0.8;
        }

        p:first-of-type {
          margin-top: 0;
          opacity: 1;
          font-weight: 500;
          width: 130px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        #song-title {
          margin-top: 0;
          font-size: 15px;
          font-weight: 500;
          opacity: 1;
        }
      }
    }

    &__controls {
      position: absolute;
      bottom: 110px;
    }
  }
}
</style>
