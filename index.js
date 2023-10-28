import express from 'express';
import cors from 'cors';

import cloudConnection from './db-utils/db-connection.js';
import userRouter from './route/userRoute.js';
import mailRouter from './route/mailRoute.js';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());
app.use(cors());
await cloudConnection();
const authMiddleware =(req,res,next)=>{
    // const [,token]=req.headers['authorization'].split(' ');
   const authToken=req.headers['auth-token']
    try{
        jwt.verify(authToken,process.env.JWT_SECRET);
    }catch(e)
    {
      console.error(e,'####Error occured');
      res.status(401).send({msg:'Unathorized'})
    }
   
    next();
}
const port=process.env.PORT;
app.use('/email',authMiddleware,mailRouter)

app.use('/user',userRouter)
app.listen(port,()=>console.log(`app listening on port ${port}`));