const path = require('path');

module.exports = {
  lintOnSave: false,
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.js',

      builderOptions: {
        productName: 'Land of the Rair Modding Tools',
        artifactName: 'LandOfTheRairModdingTools.${ext}',
        asar: false,

        appId: 'modding.rair.land',
        portable: {
          artifactName: 'LotRModdingTools.exe',
        },
        win: {
          publish: [],
          target: ['zip'],
          icon: './public/favicon.png',
        },
      },

      chainWebpackMainProcess(config) {
        config.module
          .rule('vue')
          .use('vue-loader')
          .loader('vue-loader')
          .tap(options => {
            options.compilerOptions.whitespace = 'preserve';
            return options;
          })
          .rule('node')
          .test(/\.node$/)
          .use('native-ext-loader')
          .loader('native-ext-loader')
          .options(
            process.env.NODE_ENV === 'development'
              ? {
                  rewritePath: path.resolve(__dirname, 'native'),
                }
              : {},
          );
      },
    },
  },
};
