export default {
  methods: {
    loadTheme() {
      const fs = require("fs");
      const { remote } = require("electron");

      this.$store.dispatch("setDocumentsPath", remote.app.getPath("userData"));

      // Get all paths on the machine for needed themes
      const themesPath = this.$store.state.documentsPath + "/mustap/themes/";
      const defaultColorsPath = themesPath + "default.json";
      const currentColorsPath = themesPath + "currentTheme.json";

      // set colors of css variables based on the themes found
      if (fs.existsSync(defaultColorsPath)) {
        const { colors } = JSON.parse(fs.readFileSync(currentColorsPath));
        const root = document.documentElement.style;

        const propNames = [
          "--dark-bg",
          "--main-bg",
          "--lighter-bg",
          "--primary-text",
          "--secondary-text",
          "--accent-color",
          "--accent-color-secondary",
          "--navbar-logo-bg",
          "--alert-hover-color",
          "--filter"
        ];

        const currentColorsPropNames = [
          "darkBg",
          "mainBg",
          "lighterBg",
          "primaryText",
          "secondaryText",
          "accentColor",
          "accentColorSecondary",
          "navbarLogoBg",
          "alertHoverColor",
          "filter"
        ];

        propNames.forEach((val, index) => {
          root.setProperty(val, colors[currentColorsPropNames[index]]);
        });

        console.log(colors);

        this.$store.dispatch("setProp", {
          prop: "imageFilter",
          data: colors.filter
        });
      } else {
        // choses default values for colors that will be used if this is the first time the app has been loaded
        const defaultColors = {
          darkBg: "#000",
          mainBg: "#121212",
          lighterBg: "#242424",
          primaryText: "#FFF",
          secondaryText: "rgba(255, 255, 255, 0.7)",
          accentColor: "#E91EA4",
          accentColorSecondary: "#E91E63",
          navbarLogoBg: "#FFF",
          alertHoverColor: "#353535", // a bit lighter than lighterBG
          filter: this.convertColorToFilter("#FFF")
        };

        this.$store.dispatch("setProp", {
          prop: "imageFilter",
          data: defaultColors.filter
        });

        const theme = {
          colors: defaultColors,
          name: "Default Theme",
          creator: "Mustap",
          description: "The default Mustap theme"
        };

        fs.promises
          .mkdir(themesPath, { recursive: true })
          .then(async () => {
            await fs.promises.writeFile(
              defaultColorsPath,
              JSON.stringify(theme)
            );
            await fs.promises.writeFile(
              currentColorsPath,
              JSON.stringify(theme)
            );
          })
          .catch(err => console.log(err));
      }
    }
  }
};