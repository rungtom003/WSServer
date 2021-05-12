const http = require("http");
const WebSocket = require("ws");
const url = require("url");
const sql = require("mssql");
const { poolConection } = require("./config");

const server = http.createServer();
const wss1 = new WebSocket.Server({ noServer: true });
const wss2 = new WebSocket.Server({ noServer: true });
const wss3 = new WebSocket.Server({ noServer: true });

wss1.on("connection", function connection(ws) {
  console.log("connection ws");
  ws.on("message", function incoming(data) {
    wss1.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });
});

wss2.on("connection", function connection(ws) {
  console.log("connection ws");
  ws.on("message", () => {
    setInterval(() => {
        let d = new Date();
        let n = d.toLocaleString();
        ws.send(n)
    }, 1000);
  });
});

wss3.on("connection", function connection(ws) {
    console.log("connection ws");
    ws.on("message",async (message) => { 
      setInterval(async () => {
        let _Data = await dbWoven();
        ws.send(JSON.stringify(_Data));
      }, 5000);      
    });    
  });

async function dbWoven(){
    const poolIP = await poolConection;
    const resultipplc = await poolIP
        .request()
        .query(`SELECT * FROM [dbWoven].[dbo].[TatePLC_Invertor]`);
    return resultipplc.recordset;
}

server.on("upgrade", function upgrade(request, socket, head) {
  const pathname = url.parse(request.url).pathname;

  if (pathname === "/foo") {
    wss1.handleUpgrade(request, socket, head, function done(ws) {
      wss1.emit("connection", ws, request);
    });
  } else if (pathname === "/DateTime") {
    wss2.handleUpgrade(request, socket, head, function done(ws) {
      wss2.emit("connection", ws, request);
    });
  } else if (pathname === "/dbWoven") {
    wss3.handleUpgrade(request, socket, head, function done(ws) {
      wss3.emit("connection", ws, request);
    });
  } else {
    socket.destroy();
  }
});

server.listen(8088, () => {
  console.log("connection PORT 8088");
});
