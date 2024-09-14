import { Injectable } from '@nestjs/common';
import { SharedService } from '@your-org/common-modules';

@Injectable()
export class AppService {
  constructor(private readonly helloService: SharedService) {}
  getHello(): string {
    return this.helloService.getHello();  
  }
}
