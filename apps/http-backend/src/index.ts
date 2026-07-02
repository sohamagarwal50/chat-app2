import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import {RoomSchema, SigninSchema, UserSchema} from "@repo/common/types";
import {prismaClient} from "@repo/db/client";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors());
app.post("/room",async(req,res) =>{
    const parsedData = RoomSchema.safeParse(req.body.body);

    if(!parsedData.success){
        res.json({
            message : "invalid input"
        })
        return;
    }
    const userId = req.body.userId;
    console.log(userId);
    try{
        const room = await prismaClient.room.create({
            data : {
                slug : parsedData.data.name,
                adminId : userId
            }
        })
        res.json({
            roomId : room.id,
            message : "room created"
        })
        return;
    }
    catch (err){
        console.log(err);
        res.status(409).json({
            message : "could not create room"
        })
    }
})
app.get("/chat/:roomId",async (req,res) =>{
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