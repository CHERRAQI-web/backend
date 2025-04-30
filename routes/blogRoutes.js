// routes/blogRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const Blog = require('../models/Blog');

const router = express.Router();

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// POST /api/blogs
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, author, content } = req.body;
    const imageUrl = `/uploads/${req.file.filename}`;
    const newBlog = new Blog({ title, author, content, imageUrl });
    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la création du blog.' });
  }
});

// Optional: GET /api/blogs (list all blogs)
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération.' });
  }
});

module.exports = router;
