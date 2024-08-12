import express from "express"
import multer from "multer"
import {Low} from "lowdb"
import cors from "cors"
import { JSONFile } from "lowdb/node"

const upload=multer()
const defaultDate={article:[]}
const db=new Low(new JSONFile("article.json"),defaultDate)
await db.read()

let whitelist = ["http://localhost:3001", "http://localhost:3000"];
let corsOptions = {
    credentials: true,
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}
const app = express();
app.use(cors(corsOptions));


app.get("/",(req,res)=>{
    res.send("首頁")
})

app.get("/api/articles",(req,res)=>{
    let articles=db.data.article.map(a=>{
        const {article_delete,...other}=a
        return other
    })
    if(!articles){
        return res.status(404).json({
            // test
            status:"fail",
            message:"找不到文章"
        })
    }
    res.status(200).json({
        status:"success",
        message:"所有文章",
        articles
    })
})


app.listen(3001,()=>{
    console.log("http://localhost:3001");
})