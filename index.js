import express, { response } from"express";
import axios  from "axios";
import movieQuotes  from "movie-quotes";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from 'path';  // Import path module
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');
// Set the views directory
app.set('views', path.join(__dirname, 'views'));
const port = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
 const ApiEndpt="https://www.googleapis.com/books/v1/volumes?q=";

 const API_KEY =process.env.GOOGLE_BOOKS_API_KEY;
 
 


 app.get("/",(req,res)=>{
const quotes=movieQuotes.random();
    res.render("start",{quotes:quotes})
 });

app.post("/search", async (req,res)=>{
   try{
  const title= req.body.title;
  const response = await axios.get(`${ApiEndpt}${title}&maxResults=40`);
  const result=response.data;
 
res.render("result",{title:title,result:result})
   }catch(error){
res.render("result",{title: "no match found",result:[]})
res.status(503).send("503 too many request 😣😣😣😣")
   }

})
 app.get("/home", async(req,res)=>{
   try{
      const response1 = await axios.get( `https://www.googleapis.com/books/v1/volumes?q=subject:health+mind+body&maxResults=15&key=${API_KEY}`);
      const response2= await axios.get( `https://www.googleapis.com/books/v1/volumes?q=subject:fiction&orderBy=relevance&maxResults=15&orderBy=newest&key=${API_KEY}`);
      const result1=response1.data;
      const result2=response2.data;
res.render("home",{result1:result1,result2:result2})   ;    
   }
   catch(error){
      console.error('Error fetching trending books:', error);
      res.render("home",{result:[]})
      res.status(503).send("503 too many request 😣😣😣😣")
   }
 })
 app.get("/item",async(req,res)=>{
  
   try{   const selfLink=req.query.selfLink;
    const text=req.query.textSnippet;  
   const response= await axios.get( `${selfLink}`)
      const result=response.data;
   res.render("item",{result:result,text:text});
   }catch(error){
      res.status(503).send("503 too many request 😣😣😣😣")
   }

 })
 app.post("/category", async(req,res)=>{
   try{
const category=req.body.id;
const response = await axios.get(`${ApiEndpt}subject:${category}&maxResults=40`);
const result=response.data;
res.render("result",{title:category,result:result});


   }catch(error){
res.render("result",{title: "no match found",result:[]})
res.status(503).send("503 too many request 😣😣😣😣")
   }


 })
app.get("/test",(req,res)=>{
  res.send("ok200")
})

 app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
