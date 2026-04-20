import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export async function uploadToCloudinary(fileBuffer, filename) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'newsflow',
        public_id: filename,
        overwrite: true,
        resource_type: 'image',
        transformation: [{ width: 1200, height: 630, crop: 'fill', quality: 'auto' }],
      },
      (error, result) => {
        if (error || !result) return reject(error)
        resolve({ url: result.secure_url, publicId: result.public_id })
      }
    )
    stream.end(fileBuffer)
  })
}

export async function deleteFromCloudinary(publicId) {
  await cloudinary.uploader.destroy(publicId)
}

export default cloudinary