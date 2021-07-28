require('dotenv').config()
const WebSocket = require('ws');

const main = async () => {
let clients = [
    new WebSocket('wss://www.pathofexile.com/api/trade/live/Expedition/NK6Ec5', {
        headers: {
          "User-Agent": process.env.USER_AGENT,
          cookie: `POESESSID=${process.env.POESESSID}`,
        },
      }),
  ];

  clients.map(client => {
      client.on('upgrade', (e) => {console.log('upgrade', e)})
    client.on('message', msg => console.log(msg));
    client.on('error', (e) => {console.log('error', e)})
  });
}

main();
