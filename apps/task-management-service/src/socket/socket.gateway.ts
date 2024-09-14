// apps/chat-server/src/socket/socket.gateway.ts
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { KafkaService } from '@app/kafka/kafka.service';
import { Inject, forwardRef } from '@nestjs/common';

@WebSocketGateway({ namespace: '/websocket' })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(forwardRef(() => KafkaService))
    private readonly kafkaService: KafkaService
  ) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message.send')
  async handleMessageSend(@MessageBody() message: any): Promise<void> {
    await this.kafkaService.sendMessage('queue.message.send', message);
    console.log(`Message sent to Kafka topic "queue.message.send": ${JSON.stringify(message)}`);
  }
}
