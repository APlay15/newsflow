import slugify from 'slugify'
import { prisma } from '../lib/prisma.js'

export async function generateUniqueSlug(title, excludeId = null) {
  const baseSlug = slugify(title, { lower: true, strict: true })

  const existing = await prisma.post.findFirst({
    where: {
      slug: baseSlug,
      ...(excludeId ? { NOT: { id: excludeId } } : {}),
    },
  })

  if (!existing) return baseSlug
  return `${baseSlug}-${Date.now()}`
}