import express from "express"
import multer from "multer"
import { Low } from "lowdb"
import cors from "cors"
import { JSONFile } from "lowdb/node"
import connect from "./db.js"

const upload = multer()
const defaultDate = { article: [] }
const db = new Low(new JSONFile("article.json"), defaultDate)
await db.read()

const app = express();
app.use(cors());


app.get("/", (req, res) => {
    res.send("首頁")
})

app.get("/api/articles", (req, res) => {
    connect.execute(
        "SELECT * FROM `article` WHERE `article_delete` = 0 ORDER BY `create_at` DESC",
        (err, articles) => {
            if (err) {
                console.log(err);
                return
            }
            res.status(200).json({
                status: "success",
                message: "所有文章",
                articles
            })
        }
    )
})

app.get("/api/articles/:sort", (req, res) => {
    const sort = req.params.sort
    if (sort) {
        connect.execute(
            "SELECT * FROM `article` WHERE `article_delete` = 0 AND sort = ? ORDER BY `create_at` DESC", [sort],
            (err, articles) => {
                if (err) {
                    console.log(err);
                    return
                }
                res.status(200).json({
                    status: "success",
                    message: "所有文章",
                    articles
                })
            }
        )
    }

})

app.get("/api/sort", (req, res) => {
    connect.execute(
        "SELECT * FROM `article_sort`",
        (err, sorts) => {
            if (err) {
                console.log(err);
                return
            }
            res.status(200).json({
                status: "success",
                message: "所有分類",
                sorts
            })
        }
    )
})

app.get("/api/articleContent/:id", (req, res) => {
    const id = req.params.id
    connect.execute(
        "SELECT * FROM `article` WHERE `id`= ? AND `article_delete` = 0", [id],
        (err, content) => {
            if (err) {
                console.log(err);
                return
            }
            res.status(200).json({
                status: "success",
                message: "文章內容",
                content
            })
        }
    )
})



app.listen(3001, () => {
    console.log("http://localhost:3001");
})