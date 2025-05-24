import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.ts'
import authRoutes from './routes/authRoutes.ts'
import postRoutes from './routes/postRoutes.ts';
import requestRoutes from './routes/requestRoutes.ts';
import favoriteRoutes from './routes/favoriteRoutes.ts';
import wishlistRoutes from './routes/wishlistRoutes.ts';
import { getUser } from './middlewares/index.ts';
import notificationRoutes from './routes/notificationRoutes.ts';

dotenv.config()

const app = express()
const port = 3000

export let clients: express.Response[] = [];

export let signedClients = new Map<number, express.Response>();

export function sendClientRefetchRequests(userId: number, type:string) {
  signedClients.get(userId)?.write(`event: refetchrequests\ndata: ${type}\n\n`);
}

export function sendClientRequestStatus(userId:number, requestId:number,status:string){
  const data = {
    requestId,
    status
  }
  signedClients.get(userId)?.write(`event: requeststatus\ndata: ${JSON.stringify(data)}\n\n`);
}
export function sendClientRequestProposalDetails(userId:number, requestId:number, details:any){
  const data = {
    requestId,
    ...details
  }
  signedClients.get(userId)?.write(`event: requestproposal\ndata: ${JSON.stringify(data)}\n\n`);
}



app.use("/uploads", express.static("uploads"));
app.use(cors(
  {
  origin: 'http://localhost:5173',
  credentials: true,
}
))
app.use(cookieParser())
app.use(express.json())

app.use('/users', userRoutes )
app.use('/auth', authRoutes )
app.use('/posts', postRoutes )
app.use('/requests', requestRoutes )
app.use('/favorites', favoriteRoutes )
app.use('/wishlist', wishlistRoutes )
app.use('/notifications', notificationRoutes)

app.get('/events', getUser ,async(req, res) => {
  const userId = req.user?.id;
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });
  res.flushHeaders(); // flush headers to establish SSE
  if(!!userId){
    signedClients.set(userId, res);
  }
  clients.push(res);
  req.on('close', () => {
    clients = clients.filter(c => c !== res);
  });
})

app.get('/test', (req, res) => {
  clients.forEach(client =>
    client.write(`data: red\n\n`)
  );
  res.send('ok');
})

app.listen(port, () => {
  console.log(`BookBarter Backend listening on port ${port}`)
})