export interface Post {
  id: string
  slug: string
  title: string
  content: string
  imageUrl: string | null
  published: boolean
  createdAt: string
  updatedAt: string
}

export interface PaginatedPosts {
  posts: Post[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface CreatePostInput {
  title: string
  content: string
  imageUrl?: string
  image?: File
}

export interface UpdatePostInput extends Partial<CreatePostInput> {
  removeImage?: boolean
}