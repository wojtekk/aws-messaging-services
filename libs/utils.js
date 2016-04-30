const localtunnel = require('localtunnel');
const urlParser = require('url');

function createLocalTunnel(port, appUrl) {
  if (!appUrl) {
    console.error('Set environment variable: SNS_HTTP_APP_URL (f.ex. in file .env)');
    process.exit(1);
  }

  const appDomain = urlParser.parse(appUrl).host;
  if (appDomain.split('.')[1] !== 'localtunnel') {
    console.error('Set proper: SNS_HTTP_APP_URL (in file .env) if you want to use LocalTunnel.');
  }
  const tunnelSubdomain = appDomain.split('.').shift();

  const tunnelOpts = {
    subdomain: tunnelSubdomain,
  };
  localtunnel(port, tunnelOpts, (err, tunnel) => {
    if (err) {
      console.error(err);
      process.exit(1);
    } else {
      console.log(`External URL: ${tunnel.url}`);
    }
  });
}

function createFakeMessage() {
  const actions = ['created', 'modified', 'deleted'];
  const randomAction = actions[Math.floor(Math.random() * actions.length)];
  const randomElementId = Math.floor(Math.random() * 10000);
  return {
    subject: `Element ${randomAction}`,
    body: { action: randomAction, elementId: randomElementId },
  };
}

module.exports = {
  createLocalTunnel,
  createFakeMessage,
};
