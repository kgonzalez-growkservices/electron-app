import { defineConfig } from 'cypress';
// import customViteConfig from './vite.config';

export default defineConfig({
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
      // optionally pass in vite config
      // viteConfig: customViteConfig,
      // or a function - the result is merged with
      // any `vite.config` file that is detected
      //   viteConfig: async () => {
      //     // ... do things ...
      //     const modifiedConfig = await injectCustomConfig(baseConfig)
      //     return modifiedConfig
      //   },
    },
  },

  e2e: {
    setupNodeEvents(on) {
      // implement node event listeners here
      //Implement startElectronApp
      on('before:browser:launch', (browser = {}, launchOptions) => {
        if (browser.name === 'electron') {
          // run code for Electron browser in 4.0.0
          return launchOptions;
        }
      });
    },
  },
});
