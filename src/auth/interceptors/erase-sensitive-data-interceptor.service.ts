import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class EraseSensitiveDataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((val) => {
        if (val.customer) {
          delete val.customer.password;
        }

        return val;
      }),
    );
  }
}
