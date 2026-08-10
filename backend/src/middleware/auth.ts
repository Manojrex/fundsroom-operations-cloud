import {Request,Response,NextFunction} from 'express'; import {verifyToken} from '../auth';
export interface AuthRequest extends Request{user?:any}
export function auth(req:AuthRequest,res:Response,next:NextFunction){const h=req.headers.authorization;if(!h?.startsWith('Bearer '))return res.status(401).json({message:'Authentication required'});try{req.user=verifyToken(h.slice(7));next()}catch{return res.status(401).json({message:'Invalid or expired token'});}}
export const roles=(...allowed:string[])=>(req:AuthRequest,res:Response,next:NextFunction)=>allowed.includes(req.user?.role)?next():res.status(403).json({message:'You do not have permission for this action'});
