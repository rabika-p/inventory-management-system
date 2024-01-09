import express, { Express, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
dotenv.config(); 

import {env} from './config'
import routes from './User';

import cors from 'cors';
import { ErrorHandler } from './User/Middleware';
import productRoutes from './Product';

const { MongoClient  } = require("mongodb");

const app: Express = express();
const port = process.env.PORT;

const http = require("http");
const socketIo = require ("socket.io");

const client = new MongoClient(process.env.URI);

app.use(bodyParser.json());
app.use(cors());

//create http server, specify origin allowed to connect to server
const server=http.createServer(app)
const io=socketIo(server,{
  cors:{
    origin:["http://localhost:5173"],
    methods:["GET","POST"]
  }
})

interface IUser {
  username: string;
  socketId: string;
}


let onlineUsers:IUser[]=[];
//add new user to list of onlineUsers
const addNewUser = (username:string, socketId:string): void => {
  !onlineUsers.some((user) => user.username === username) &&
    onlineUsers.push({ username, socketId });
};

//remove user when they disconnect
const removeUser = (socketId:string): void => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

//retreive user information based on username
const getUser = (username:string): IUser | undefined => {
  return onlineUsers.find((user) => user.username === username);
};

//listen for connection (when client establishes a websocket connection with server)
io.on("connection", (socket:any) => {
  console.log("Connected user:", socket.id);
  socket.emit("From server");
  socket.on("newUser", (username:string) => {
    // console.log("Backend", username);
    io.emit("Connected user:", username);
    addNewUser(username, socket.id);
  });

  //listen for events from client and execute callback functions
  socket.on("sendNotification", ({ senderName, receiverName, productName }:any) => {
    console.log("Sender, Receiver", senderName, receiverName);
    const receiver = getUser(receiverName);
    if (receiver){
      console.log(receiver.socketId)
      io.to(receiver.socketId).emit("getNotification", {
        senderName, productName
      });
    }
    else{
      console.log("Receiver not found");
    }
    
  });

  socket.on("disconnect",()=>{
    console.log("User", socket.id, "disconnected")
    removeUser(socket.id);
  })
});

//connect to db in mongo 
app.get("/api/connect-db", (req, res) => {
  client.connect()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err: Error) => { 
    console.error("Error connecting to MongoDB:", err);
  })
});


app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});
app.use('/user', routes());
app.use('/product', productRoutes());

app.all('*', function (req, res, next) {
    const err = {
      message: "Cannot find path on the server",
      status: 404,
    };

    next(err);
});

// Error Hanlder Middleware
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  ErrorHandler(error, req, res, next);
});

server.listen(env.PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${env.PORT}`);
});
 