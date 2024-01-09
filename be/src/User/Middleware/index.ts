import { Request, Response, NextFunction } from "express";

//to import JSON web token for authentication
const jwt = require('jsonwebtoken');


export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null){
    return res.sendStatus(401); //unauthorized
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err:any,decoded:any) =>{
  if (err){
    return res.sendStatus(403); //forbidden access
  }
  req.user = decoded;
  console.log(decoded);
  console.log("User authenticated")
  next();
  })
}

export const ErrorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    const errStatus = error.status || 500;
    const errMsg = error.message || 'Something went wrong';
    res.status(errStatus).json({
        success: false,
        status: errStatus,
        message: errMsg,
    });
};


