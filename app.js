var bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    express     = require("express"),
    app         = express();

mongoose.Promise = global.Promise;    
// mongoose.connect("mongodb://localhost/restful_blog_app");
mongoose.connect("mongodb://localhost/restful_blog_app", {useMongoClient: true});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: 
        {
            type: Date, 
            default: Date.now
        }
});
var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Test Blog",
//     image: "https://images.unsplash.com/photo-1428447207228-b396f310848b?dpr=1&auto=compress,format&fit=crop&w=2700&h=&q=80&cs=tinysrgb&crop=",
//     body: "Hello.. This is a blog post!"
// }, function(err, blog){
//     if(err){
//         console.log(err);
//     } else {
//         console.log(blog);
//     }
// });

app.get("/", function(req, res){
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        } else {
            res.render("index", {blogs, blogs});            
        }
    });
});

app.listen(3000, "localhost", function(){
    console.log("Server is running!");
});