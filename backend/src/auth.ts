import jwt from 'jsonwebtoken'; import bcrypt from 'bcryptjs';
const secret=process.env.JWT_SECRET||'dev-secret-change-me';
export const hashPassword=(p:string)=>bcrypt.hash(p,10); export const comparePassword=(p:string,h:string)=>bcrypt.compare(p,h);
export function signToken(user:any){return jwt.sign({id:user.id,name:user.name,email:user.email,role:user.role},secret,{expiresIn:'8h'});}
export function verifyToken(t:string){return jwt.verify(t,secret) as any;}
