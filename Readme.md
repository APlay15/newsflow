# NewsFlow 📰

Gestor de noticias full stack moderno construido con Next.js, Express y PostgreSQL.

## 🚀 Demo

- **Frontend:** [https://newsflow-mu.vercel.app](https://newsflowv2.vercel.app)
- **Backend:** [https://newsflow-backend-omf6.onrender.com](https://newsflow-backend-omf6.onrender.com)

## 🛠️ Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 14, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express, Prisma ORM |
| Base de datos | PostgreSQL (Supabase) |
| Imágenes | Cloudinary |
| i18n | next-intl (ES/EN) |
| Deploy | Vercel + Render |

## ✨ Funcionalidades

- ✅ Crear, editar y eliminar noticias
- ✅ Listado con paginación y búsqueda en tiempo real
- ✅ Página de detalle por slug
- ✅ Subida de imágenes (archivo o URL)
- ✅ Internacionalización ES/EN
- ✅ Animaciones con Framer Motion
- ✅ Diseño minimalista y responsivo
- ✅ Manejo de estados de carga y errores

## 📁 Estructura del proyecto

newsflow/
├── backend/          # API REST con Express + Prisma
│   ├── prisma/       # Schema y migraciones
│   └── src/
│       ├── controllers/
│       ├── routes/
│       ├── middlewares/
│       └── lib/
└── frontend/         # Next.js App Router
├── messages/     # Traducciones ES/EN
└── src/
├── app/
├── components/
└── lib/

## ⚙️ Instalación local

### Requisitos
- Node.js 18+
- Cuenta en Supabase
- Cuenta en Cloudinary

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tus credenciales
npx prisma generate
node prisma/seed.js
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# Editar .env.local con la URL del backend
npm run dev
```

## 🌐 Variables de entorno

### Backend `.env`
```env
PORT=4000
DATABASE_URL="postgresql://..."
FRONTEND_URL="http://localhost:3000"
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

### Frontend `.env.local`
```env
NEXT_PUBLIC_API_URL="http://localhost:4000/api"
```

## 📡 API Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/posts` | Listar posts |
| GET | `/api/posts/:slug` | Ver post |
| POST | `/api/posts` | Crear post |
| PATCH | `/api/posts/:id` | Editar post |
| DELETE | `/api/posts/:id` | Eliminar post |
