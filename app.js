const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

//app config
mongoose.connect('mongodb://localhost/blog');
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));

//mongoose config
const blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});

const Blog = mongoose.model('Blog', blogSchema);

//routes

app.get('/', (req, res) => {
res.redirect('/blogs');
});

app.get('/blogs', (req, res) => {
	Blog.find({}, (err, blogs) => {
		if(err) {
			console.log('Error!!!');
		} else {
			res.render('index', {blogs: blogs});
		}
	});
});

app.get('/blogs/new', (req, res) => {
	res.render("new");
});

//CREATE route
app.post('/blogs', (req, res) => {
	Blog.create(req.body.blog, (err, newBlog) => {
		if(err) {
			res.render('new');
		} else {
			res.redirect('/blogs');
		}
	})
});

//SHOW route
app.get('/blogs/:id', (req, res) => {
	Blog.findById(req.params.id, (err, foundBlog) => {
		if(err) {
			res.redirect("/blogs");
		} else {
			res.render('show', {blog: foundBlog});
		}
	});
});

//EDIT route
app.get('/blogs/:id/edit', (req, res) => {
	Blog.findById(req.params.id, (err, foundBlog) => {
		if(err) {
			res.redirect('/blogs');
		} else {
			res.render('edit', {blog: foundBlog});
		}
	})
});

//UPDATE route
app.put('/blogs/:id', (req, res) => {
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
		if(err) {
			res.redirect('/blogs');
		} else {
			res.redirect('/blogs/' + req.params.id);
		}
	})
});

// DELETE route
app.delete('/blogs/:id', (req, res) => {
	Blog.findByIdAndRemove(req.params.id, (err) => {
		if(err) {
			console.log("OMG NO ERROR")
			res.redirect('/blogs');
		} else {
			res.redirect('/blogs');
		}
	})
});


app.listen(3000, () => {
	console.log('Port 3000 ACTIVATED')
})