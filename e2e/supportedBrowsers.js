const LATEST_MAC = 'macOS 10.15';
const LATEST_WINDOWS = 'Windows 10';

module.exports = {
  multiCapabilities: [
    {
      browserName: 'chrome',
      version: 'latest',
      platform: LATEST_WINDOWS,
      screenResolution: '1600x1200',
      name: 'Media Viewer Tests:Mac Chrome',
      tunnelIdentifier: process.env.TUNNEL_IDENTIFIER || 'reformtunnel',
      extendedDebugging: true,
      capturePerformance: true,
      sharedTestFiles: true,
      maxInstances: 1
    },
    {
      browserName: 'firefox',
      version: 'latest',
      platform: LATEST_MAC,
      name: 'Media Viewer Tests:Mac Firefox',
      tunnelIdentifier: process.env.TUNNEL_IDENTIFIER || 'reformtunnel',
      extendedDebugging: true,
      capturePerformance: true,
      sharedTestFiles: false,
      maxInstances: 1
    },
    {
      browserName: 'chrome',
      version: 'latest',
      platform: LATEST_WINDOWS,
      name: 'Media Viewer Tests:Windows Chrome',
      tunnelIdentifier: process.env.TUNNEL_IDENTIFIER || 'reformtunnel',
      extendedDebugging: true,
      capturePerformance: true,
      sharedTestFiles: false,
      maxInstances: 1
    },
    {
      browserName: 'firefox',
      version: 'latest',
      platform: LATEST_WINDOWS,
      name: 'Media Viewer Tests:Windows Firefox',
      tunnelIdentifier: process.env.TUNNEL_IDENTIFIER || 'reformtunnel',
      extendedDebugging: true,
      capturePerformance: true,
      sharedTestFiles: false,
      maxInstances: 1
    },
    {
      browserName: 'safari',
      platform: LATEST_MAC,
      version: 'latest',
      name: 'Media Viewer Tests:Mac Safari',
      tunnelIdentifier: process.env.TUNNEL_IDENTIFIER || 'reformtunnel',
      seleniumVersion: '3.141.59',
      screenResolution: '1400x1050',
      extendedDebugging: true,
      capturePerformance: true,
      sharedTestFiles: false,
      maxInstances: 1,
    },
    {
      browserName: 'MicrosoftEdge',
      version: 'latest',
      platform: LATEST_WINDOWS,
      name: 'Media Viewer Tests Windows Edge',
      tunnelIdentifier: process.env.TUNNEL_IDENTIFIER || 'reformtunnel',
      extendedDebugging: true,
      capturePerformance: true,
      sharedTestFiles: false,
      maxInstances: 1
    },
  ],
};
