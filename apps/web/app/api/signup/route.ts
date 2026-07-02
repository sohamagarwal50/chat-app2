import { NextResponse } from "next/server";
import { prismaClient } from "@repo/db/client"
import {UserSchema} from "@repo/common/types"
export async function POST(req : Request) {
    const body = await req.json();
    console.log(body);
    const parsedData = await UserSchema.safeParse(body);
    if(!parsedData.success){
        return NextResponse.json({
            message : "Invalid Inputs"
        })
        return;
    }
    try{
        const user = await prismaClient.user.create({
            data :{
                email : parsedData.data.username,
                password : parsedData.data.password
            }
        });
        return NextResponse.json({
            message : "Successfully added to db"
        });
    }
    catch(err){
        console.log("Error in adding to db: "+err);
        return NextResponse.json({
            message : "user already exists"
        });
        return;
    }

}