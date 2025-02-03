import { prisma } from "./db.server";

export async function checkIfAdmin(userId:string){
    await prisma.report.findFirst({ where:{ userId } })
    .then(( userGroup:any )=>{
        if( userGroup == 0 ){
            return true;
        }
        else { return false; }
   });
}

export async function checkLogin(formData:any){
    const id = formData.get('id');
    const returnInfo = { isAdmin:false }
    await prisma.user.findUnique({ where:{ id } })
    .then(( Password:any )=>{
        if( Password == formData.get('password') ){
            return true;
        }
        else { return false; }
   });
}