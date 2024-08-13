import express from "express"
import multer from "multer"
import {Low} from "lowdb"
import cors from "cors"
import { JSONFile } from "lowdb/node"
import connect from "./db.js"

const upload=multer()
const defaultDate={article:[]}
const db=new Low(new JSONFile("article.json"),defaultDate)
await db.read()

const app = express();
app.use(cors());


app.get("/",(req,res)=>{
    res.send("首頁")
})

// app.get("/api/articles",(req,res)=>{
//     let articles=db.data.article.map(a=>{
//         const {article_delete,...other}=a
//         return other
//     })
//     if(!articles){
//         return res.status(404).json({
//             // test
//             status:"fail",
//             message:"找不到文章"
//         })
//     }
//     res.status(200).json({
//         status:"success",
//         message:"所有文章",
//         articles
//     })
// })

app.get("/api/articles",(req,res)=>{
    connect.execute(
        "SELECT * FROM `article` WHERE `article_delete` = 0 ORDER BY `create_at` DESC",
        (err,articles) => {
            if(err){
                console.log(err);
                return
            }
            res.status(200).json({
                status:"success",
                message:"所有文章",
                articles
            })
        }
    )
})

app.get("/api/articleContent/:id",(req,res)=>{
    const id = req.params.id
    connect.execute(
        "SELECT * FROM `article` WHERE `id`= ? AND `article_delete` = 0",[id],
        (err,content) => {
            if(err){
                console.log(err);
                return
            }
            res.status(200).json({
                status:"success",
                message:"文章內容",
                content
            })
        }
    )
})


app.listen(3001,()=>{
    console.log("http://localhost:3001");
})