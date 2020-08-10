var express=require('express');
var app=express();
var mongoose=require('mongoose');
var bodyParser=require('body-parser');
var methover=require('method-override');
var sanitize=require('express-sanitizer')
mongoose.connect("mongodb://localhost:27017/blog_app",{useNewUrlParser: true});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methover("_method"));
app.use(sanitize());

var blogSchema=new mongoose.Schema({
	title:String,
	image: String,
    body:String,
	created:{type:Date,default:Date.now}
});
var blog=mongoose.model("Blog",blogSchema);
// blog.create({
// 	title:"First Post",
// 	image:"https://toib.b-cdn.net/wp-content/uploads/2017/08/chandratal-lake-himachal-pradesh.jpg",
// 	body:"Hello this is blog post"
// });
app.get("/",function(req,res)
	   {
	res.redirect("/blogs");
	   });
app.get("/blogs",function(req,res){
	blog.find({},function(err,blogs){
		if(err) console.log(err);
		else res.render("blogs",{blogs:blogs}); 
	});
});
app.get("/blogs/new",function(req,res){
	res.render("new");
});
app.post("/blogs",function(req,res){
	req.body.blog.body=req.sanitize(req.body.blog.body);
	blog.create(req.body.blog,function(err,nblog){
		if(err) res.render("new");
		else res.redirect("/blogs");
	});
	
});
app.get("/blogs/:id",function(req,res){
	blog.findById(req.params.id,function(err,foundblog){
		if(err) res.redirect("/blogs");
		else res.render("show",{blog:foundblog});
	});
});

app.get("/blogs/:id/edit",function(req,res){
	blog.findById(req.params.id,function(err,foundblog){
		if(err) res.redirect("/blogs");
		else res.render("edit",{blog:foundblog});
	});
});

app.put("/blogs/:id",function(req,res){
	req.body.blog.body=req.sanitize(req.body.blog.body);
	blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedblog){
		if(err) res.redirect("/blogs");
		else res.redirect("/blogs/"+req.params.id);
	});
});
app.delete("/blogs/:id",function(req,res){
	blog.findByIdAndRemove(req.params.id,function(err){
		if(err) res.redirect("/blogs");
		else res.redirect("/blogs");
	});
	
});


app.listen(process.env.PORT||3000,process.env.IP,function(){
	console.log("Server has started!!!!");
});