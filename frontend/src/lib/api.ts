import axios from 'axios'
import type { Post, PaginatedPosts, ApiResponse, CreatePostInput, UpdatePostInput } from '@/types'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  timeout: 15000,
})

export async function getPosts(params?: {
  page?: number
  limit?: number
  search?: string
}): Promise<PaginatedPosts> {
  const { data } = await api.get<ApiResponse<PaginatedPosts>>('/posts', { params })
  return data.data
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const { data } = await api.get<ApiResponse<Post>>(`/posts/${slug}`)
  return data.data
}

export async function createPost(input: CreatePostInput): Promise<Post> {
  const formData = new FormData()
  formData.append('title', input.title)
  formData.append('content', input.content)
  if (input.image) formData.append('image', input.image)
  else if (input.imageUrl) formData.append('imageUrl', input.imageUrl)

  const { data } = await api.post<ApiResponse<Post>>('/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.data
}

export async function updatePost(id: string, input: UpdatePostInput): Promise<Post> {
  const formData = new FormData()
  if (input.title) formData.append('title', input.title)
  if (input.content) formData.append('content', input.content)
  if (input.image) formData.append('image', input.image)
  else if (input.imageUrl) formData.append('imageUrl', input.imageUrl)
  if (input.removeImage) formData.append('removeImage', 'true')

  const { data } = await api.patch<ApiResponse<Post>>(`/posts/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.data
}

export async function deletePost(id: string): Promise<void> {
  await api.delete(`/posts/${id}`)
}