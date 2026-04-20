import { PrismaClient } from '@prisma/client'
import slugify from 'slugify'

const prisma = new PrismaClient()

const posts = [
  {
    title: 'Bienvenido a NewsFlow',
    content: 'NewsFlow es una plataforma moderna para gestionar noticias. Este es tu primer post, puedes editarlo o eliminarlo.',
    imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800',
  },
  {
    title: 'Cómo empezar con desarrollo Full Stack',
    content: 'El desarrollo full stack implica trabajar tanto en el frontend como en el backend. Aprende las herramientas clave para construir aplicaciones modernas.',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
  },
  {
    title: 'Por qué usar Next.js en tus proyectos',
    content: 'Next.js ofrece renderizado del lado del servidor, generación estática y un sistema de rutas potente. Descubre por qué es la elección de miles de equipos.',
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800',
  },
]

async function main() {
  console.log('Insertando datos...')
  await prisma.post.deleteMany()
  for (const post of posts) {
    const slug = slugify(post.title, { lower: true, strict: true })
    await prisma.post.create({ data: { ...post, slug } })
    console.log(`Creado: "${post.title}"`)
  }
  console.log('Listo!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())