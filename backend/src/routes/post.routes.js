import { Router } from 'express'
import { getAllPosts, getPostBySlug, createPost, updatePost, deletePost } from '../controllers/post.controller.js'
import { upload } from '../middlewares/upload.js'

const router = Router()

// Listar todos los posts
router.get('/', getAllPosts)

// Ver un post por slug
router.get('/:slug', getPostBySlug)

// Crear post (acepta imagen subida o URL)
router.post('/', upload.single('image'), createPost)

// Editar post
router.patch('/:id', upload.single('image'), updatePost)

// Eliminar post
router.delete('/:id', deletePost)

export default router