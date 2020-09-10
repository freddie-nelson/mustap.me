module.exports = {
  configureWebpack: {
    target: "electron-renderer"
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: "Mustap",
        linux: {
          icon: "public/512x512.png",
          target: ["AppImage", "snap"],
        },
        win: {
          icon: "public/icon.ico",
        },
      },
    },
  },
};