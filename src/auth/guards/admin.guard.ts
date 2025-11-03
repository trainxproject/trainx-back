import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";



@Injectable()



export class JwtAuthGuard extends AuthGuard("jwt"){}


export class AdminGuard implements CanActivate {
    
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    
            const request = context.switchToHttp().getRequest()


            const user = request.user
           

            if (!user) {
            throw new ForbiddenException('No user information found in request. Make sure JwtAuthGuard runs first.');
            }

            if (!user.isAdmin) {
            throw new ForbiddenException("Sorry, you don't have admin permissions.");
            }

            return true

    }


}



