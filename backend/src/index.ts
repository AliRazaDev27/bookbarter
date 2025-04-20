import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.ts'
import adminRoutes from './routes/adminRoutes.ts'

dotenv.config()

const app = express()
const port = 3000

app.use("/uploads", express.static("uploads"));

app.use(express.json())
app.use(cookieParser())
app.use(cors(
  {
  origin: 'http://localhost:5173',
  credentials: true,
}
))

app.use('/users', userRoutes )
app.use('/admin', adminRoutes )

app.listen(port, () => {
  console.log(`BookBarter Backend listening on port ${port}`)
})