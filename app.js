var bodyParser          = require("body-parser"),
    methodOverride      = require("method-override"),
    expressSanitizer    = require("express-sanitizer"),
    mongoose            = require("mongoose"),
    express             = require("express"),
    app                 = express();

mongoose.Promise = global.Promise;    

var url = process.env.DATABASEURL || "mongodb://localhost/restful_blog_app";

// mongoose.connect("mongodb://localhost/restful_blog_app");
//MongoLab URL: mongodb://blog:app@ds231245.mlab.com:31245/restful_blog_app
mongoose.connect(url, {useMongoClient: true});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

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

app.get("/blogs/new", function(req, res){
    res.render("new");
});

app.post("/blogs", function(req, res){
    // console.log(req.body);
    req.body.blog.body = req.sanitize(req.body.blog.body);
    // console.log("=================");
    // console.log(req.body);
    Blog.create(req.body.blog, function(err, newBlog){
    if(err){
        res.render("new");
    } else {
        res.redirect("/blogs");
    }
    });
});

app.get("/blogs/:id", function(req, res){
    // res.send("Show Page");
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log(err);
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
    });
});

app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});            
        }
    });
});

app.put("/blogs/:id", function(req, res){
    // res.send("Update Route!");
    req.body.blog.body = req.sanitize(req.body.blog.body);
    
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

app.delete("/blogs/:id", function(req, res){
    // res.send("You have reached the 'destroy' route");
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");            
        } else {
            res.redirect("/blogs");            
        }
    });
});

app.listen(process.env.PORT || 3000, "localhost", function(){
    console.log("Server is running!");
});
