import upload from "./multer.js"

const uploadSingleImage = upload.single("image")
const uploadMultipleImage = upload.array("image", 5)

export { uploadSingleImage, uploadMultipleImage }