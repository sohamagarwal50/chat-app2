import express from "express";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";
import { JWT_SECRET } from "@repo/backend-common/config";
import {RoomSchema, SigninSchema, UserSchema} from "@repo/common/types";
import {prismaClient} from "@repo/db/client";
const app = express();
app.use(express.json());
app.post("/signup",async (req,res) => {
    const parsedData = UserSchema.safeParse(req.body);
    if(!parsedData.success){
        res.json({
            message : "Incorrect input"
        });
        return;
    }
    try{
        const user = await prismaClient.user.create({
            data: {
                email: parsedData.data?.username,
                // TODO: Hash the pw
                password: parsedData.data.password,
                name: parsedData.data.name,
            }
        })
        res.json({
            userId : user?.id
        })
        return;
    }
    catch (err){
        res.json({
            message : "error signing up"
        })
    }
    //enter into db

})
app.post("/signin",async (req,res) =>{
    const data = SigninSchema.safeParse(req.body);
    if(!data.success){
        res.json({
            message :"invalid input"
        });
        return;
    }
    try{
        const user = await prismaClient.user.findFirst({
            where : {
                email : data.data.username,
                password : data.data.password
            }
        });
        console.log(user);
        const token = jwt.sign({userId : user?.id},JWT_SECRET);
        res.json({token : token,userId : user?.id });
    }
    catch (err){
        res.json({
            message : "user not found in db"
        });
    }
})
app.post("/room",middleware, async(req,res) =>{
    const parsedData = RoomSchema.safeParse(req.body);
    if(!parsedData.success){
        res.json({
            message : "invalid input"
        })
        return;
    }
    const userId = req.userId;
    console.log(userId);
    try{
        const room = await prismaClient.room.create({
            data : {
                slug : parsedData.data.name,
                adminId : userId
            }
        })
        res.json({
            roomId : room.id
        })
        return;
    }
    catch (err){
        console.log(err);
        res.json({
            message : "could not create room"
        })
    }
})
app.get("/chat/:roomId",middleware,async (req,res) =>{
    const roomId = Number(req.params.roomId);
    const messages = await prismaClient.chat.findMany({
        where :{
            RoomId : roomId
        },
        orderBy :{
            id : "desc"
        },
        take : 1000
    });
    res.json({
        messages : messages
    });
})
app.get("/room/:slug", async (req, res) => {
    const slug = req.params.slug;
    const room = await prismaClient.room.findFirst({
        where: {
            slug
        }
    });
    res.json({
        roomId : room?.id
    })
})
app.listen(3001);