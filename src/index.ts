import { AddressInfo } from "net";
import { AppDataSource } from "./data-source";
import { CustomSMTPServer } from "./server";
import { createServer } from "http";
import express, { Express } from "express";
import { createServer as createViteServer } from 'vite'


import { Server } from "socket.io";
import { apiRouter } from "./api";
import { renderer } from "./render";
import bodyParser  from 'body-parser'
import { resolveDistPath } from "./utils/resolve-path";

async function createAppServer(){
    const app: Express = express();
    const httpServer = createServer(app);
    const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'custom'
      })
    //api
    app.use(bodyParser.urlencoded({extended: false}))
    app.use(bodyParser.json())
    app.use(express.static(resolveDistPath('client')));
    app.use("/api",apiRouter);
    //Vite 
    app.use(vite.middlewares)
    app.use('*',(req,res,next)=>{
        renderer(vite, req, res,next);
    })
    return httpServer
}


AppDataSource.initialize()
  .then(async () => {
    const httpServer = await createAppServer()
    const io = new Server(httpServer);
    io.on("connection", (socket) => {
        console.log('Client connected')
    })
    const smtp = new CustomSMTPServer(
      AppDataSource.manager,
      {
        banner: "Welcome to My Awesome SMTP Server",
        name: "MAIL TEST",
        size: 10 * 1024 * 1024 * 1024,
        logger: false,
        secure: false,
        useXClient: true,
        useXForward: true,
        hidePIPELINING: true,
        disabledCommands: [ "STARTTLS"],
      },
      (email) => {
        io.emit("new-email", {email: email, source:email.from.address, target: [...email.to.map((e)=>e.address)]});
      }
    );
    smtp.listen(1027, "localhost", () => {
      const address = smtp.server.address() as AddressInfo;
      console.log(
        `SMTP SERVER Listening on [${address.address}]:${address.port}`
      );
      httpServer.listen(8000, () => {
        console.log(`Express server listening on port 8000`);
      });
    });
  })
  .catch((error) => console.log(error));
