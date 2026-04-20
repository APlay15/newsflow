import { prisma } from '../lib/prisma.js'
import { uploadToCloudinary, deleteFromCloudinary } from '../lib/cloudinary.js'
import { generateUniqueSlug } from '../utils/slug.js'
import { successResponse, errorResponse } from '../utils/response.js'

// GET /api/posts — listar todos
export async function getAllPosts(req, res) {
  try {
    const { page = '1', limit = '10', search } = req.query
    const pageNum = Math.max(1, parseInt(page))
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)))
    const skip = (pageNum - 1) * limitNum

    const where = search
      ? {
          published: true,
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { content: { contains: search, mode: 'insensitive' } },
          ],
        }
      : { published: true }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
        select: {
          id: true,
          slug: true,
          title: true,
          content: true,
          imageUrl: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.post.count({ where }),
    ])

    return successResponse(res, {
      posts,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    })
  } catch (error) {
    console.error('getAllPosts error:', error)
    return errorResponse(res, 'Error al obtener los posts')
  }
}

// GET /api/posts/:slug — ver uno
export async function getPostBySlug(req, res) {
  try {
    const post = await prisma.post.findUnique({
      where: { slug: req.params.slug },
    })

    if (!post || !post.published) {
      return errorResponse(res, 'Post no encontrado', 404)
    }

    return successResponse(res, post)
  } catch (error) {
    console.error('getPostBySlug error:', error)
    return errorResponse(res, 'Error al obtener el post')
  }
}

// POST /api/posts — crear
export async function createPost(req, res) {
  try {
    const { title, content, imageUrl } = req.body

    if (!title || title.trim().length < 3) {
      return errorResponse(res, 'El título debe tener al menos 3 caracteres', 422)
    }
    if (!content || content.trim().length < 10) {
      return errorResponse(res, 'El contenido debe tener al menos 10 caracteres', 422)
    }

    let finalImageUrl = imageUrl || null
    let imagePublicId = null

    // Si subieron un archivo, subirlo a Cloudinary
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, `post-${Date.now()}`)
      finalImageUrl = result.url
      imagePublicId = result.publicId
    }

    const slug = await generateUniqueSlug(title)

    const post = await prisma.post.create({
      data: { title, content, slug, imageUrl: finalImageUrl, imagePublicId },
    })

    return successResponse(res, post, 'Post creado exitosamente', 201)
  } catch (error) {
    console.error('createPost error:', error)
    return errorResponse(res, 'Error al crear el post')
  }
}

// PATCH /api/posts/:id — editar
export async function updatePost(req, res) {
  try {
    const { id } = req.params
    const { title, content, imageUrl, removeImage } = req.body

    const existing = await prisma.post.findUnique({ where: { id } })
    if (!existing) return errorResponse(res, 'Post no encontrado', 404)

    let finalImageUrl = existing.imageUrl
    let imagePublicId = existing.imagePublicId

    // Eliminar imagen
    if (removeImage === 'true') {
      if (existing.imagePublicId) await deleteFromCloudinary(existing.imagePublicId)
      finalImageUrl = null
      imagePublicId = null
    }

    // Nueva imagen subida
    if (req.file) {
      if (existing.imagePublicId) await deleteFromCloudinary(existing.imagePublicId)
      const result = await uploadToCloudinary(req.file.buffer, `post-${id}`)
      finalImageUrl = result.url
      imagePublicId = result.publicId
    } else if (imageUrl && imageUrl !== existing.imageUrl) {
      if (existing.imagePublicId) await deleteFromCloudinary(existing.imagePublicId)
      finalImageUrl = imageUrl
      imagePublicId = null
    }

    const slug = title ? await generateUniqueSlug(title, id) : existing.slug

    const updated = await prisma.post.update({
      where: { id },
      data: {
        ...(title ? { title, slug } : {}),
        ...(content ? { content } : {}),
        imageUrl: finalImageUrl,
        imagePublicId,
      },
    })

    return successResponse(res, updated, 'Post actualizado exitosamente')
  } catch (error) {
    console.error('updatePost error:', error)
    return errorResponse(res, 'Error al actualizar el post')
  }
}

// DELETE /api/posts/:id — eliminar
export async function deletePost(req, res) {
  try {
    const existing = await prisma.post.findUnique({ where: { id: req.params.id } })
    if (!existing) return errorResponse(res, 'Post no encontrado', 404)

    if (existing.imagePublicId) await deleteFromCloudinary(existing.imagePublicId)

    await prisma.post.delete({ where: { id: req.params.id } })

    return successResponse(res, null, 'Post eliminado exitosamente')
  } catch (error) {
    console.error('deletePost error:', error)
    return errorResponse(res, 'Error al eliminar el post')
  }
}