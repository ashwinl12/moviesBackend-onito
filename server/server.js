const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");


// creating connection pool
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "admin123",
    database: "movies_db" // name of the movies database 
});

// middleware
app.use(express.json());
app.use(cors());

app.get("/api/v1/longest-duration-movies", (req, res)=>{

    //tconst, primaryTitle, runtimeMinutes & genres
    const stmt = "select tconst, primaryTitle, runtimeMinutes, genres from movies order by runtimeMinutes desc limit 10";
    db.query(stmt, (err, result)=>{
        if(err) {
            console.log(err);
            res.send({"error":"Error occurred while fetching the data !!!"});
        } else {
            res.send(result);
        }
    });
})

app.post("/api/v1/new-movie", (req, res)=> {
    const tconst = req.body.tconst;
    const titleType = req.body.titleType; 
    const primaryTitle = req.body.primaryTitle; 
    const runtimeMinutes = req.body.runtimeMinutes; 
    const genres = req.body.genres;

    const stmt = "insert into movies values(?, ?, ?, ?, ?)";
    db.query(stmt, [tconst, titleType, primaryTitle, runtimeMinutes, genres], (err, result)=> {
        if(err) {
            console.log("error");
            res.send({"error":"could not post the movie :("});
        } else {
            console.log("movie posted successfully :)");
            res.send({"result":"Movies data posted successfully :)"});
        }
    })
})

app.get("/api/v1/top-rated-movies", (req, res)=> {
    const stmt = "select movies.tconst, primaryTitle, genres, averageRating from movies join ratings on movies.tconst = ratings.tconst where averageRating>6 order by averageRating";
    db.query(stmt, (err, result)=> {
        if(err) {
            console.log(err);
            res.send({"error":"could not fetch the data :("});
        } else {
            console.log("Data fetched !!!");
            res.send(result);
        }
    })
})

app.listen(3000, ()=> {
    console.log("Server up and running on port 3000 !");
})


