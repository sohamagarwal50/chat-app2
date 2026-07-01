import { NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"
import { Request,Response } from "express";
import {JWT_SECRET} from "@repo/backend-common/config";
export const middleware = (req : Request, res:Response, next : NextFunction) => {
    const token = req.headers["authorization"] ?? "token";
    console.log(token);
    const decoded = jwt.verify(token,JWT_SECRET) as JwtPayload & {
        userId:string
    };
    if(decoded){
        req.userId = decoded.userId;
        next();
    }
}