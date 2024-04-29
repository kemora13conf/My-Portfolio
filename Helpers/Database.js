import mongoose from "mongoose";
import { DATABASE_URL } from "../Env.js";

export default class Database{
    static instance = null;

    static async getInstance(){
        if(this.instance === null){
            try{
                const connection = await mongoose.connect(
                    process.env.DATABASE_URL,
                    {}
                );
                this.instance = connection.connection;
                console.log("Database connected");
                return this.instance;
            }catch(err){
                console.log("Database connection failed");
                throw new Error(err.message);
            }
        }

        return this.instance;
    }
}