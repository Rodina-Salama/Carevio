const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  pwa: {
    iconPaths: {
      favicon32: "favlogo.png",
      favicon16: "favlogo.png",
      appleTouchIcon: "favlogo.png",
      maskIcon: "favlogo.png",
      msTileImage: "favlogo.png",
    },
  },
});
