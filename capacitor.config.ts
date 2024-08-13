import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'farmatads',
  appName: 'farmatads',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    url: 'http://10.0.2.2:3000',
    cleartext: true
  }
};

export default config;
