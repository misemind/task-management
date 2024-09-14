// apps/chat-server/src/kafka/kafka.service.ts
import { Injectable, Inject, OnModuleInit, forwardRef } from '@nestjs/common';
import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';
import { SocketGateway } from '@app/socket/socket.gateway';

@Injectable()
export class KafkaService implements OnModuleInit {
  constructor(
    @Inject(forwardRef(() => SocketGateway))
    private readonly socketGateway: SocketGateway
  ) {}

  async onModuleInit() {
    console.log('!!!!!');
    // await this.kafkaClient.connect();
    // this.kafkaClient.subscribeToResponseOf('queue.message.send')
    // console.log('!!!!!');
  }

  async sendMessage(topic: string, message: string) {
   //x await this.kafkaClient.emit(topic, { message }).toPromise();
  }

  @EventPattern('queue.message.send')
  async handleKafkaMessageSend(@Payload() message: any): Promise<void> {
    console.log(`Emitted message to Socket.IO clients: ${JSON.stringify(message)}`);
    this.socketGateway.server.emit('message.receive', message);
 
  }
}
