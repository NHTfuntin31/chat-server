import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { Server, Socket } from 'socket.io'
import { MessageDocument } from './models/message.model';

@WebSocketGateway({
  cors: {
    origin: '*',
  }
})
export class MessagesGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messagesService: MessagesService) {}

  @SubscribeMessage('createMessage')
  async create(@MessageBody() createMessageDto: MessageDocument, @ConnectedSocket() client: Socket) {
    const message = await this.messagesService.create(createMessageDto, client.id);
    const room = await this.messagesService.getClientRoom(client.id)
    this.server.to(room).emit('message', message)

    return message
  }

  @SubscribeMessage('findAllMessages')
  findAll(@MessageBody('room') room: string) {
    console.log("dang tim kiem" + room);
    
    return this.messagesService.findAll(room);
  }

  @SubscribeMessage('join')
  joinRoom (
    @MessageBody('name') name: string, 
    @MessageBody('room') room: string,
    @ConnectedSocket() client: Socket) {
    client.join(room);
    console.log('join room=', room);
    return this.messagesService.identify(name, client.id, room);
  }

  @SubscribeMessage('leaveRoom')
  async leaveRoom(@ConnectedSocket() client: Socket) {
    const room = await this.messagesService.getClientRoom(client.id)
      client.leave(room);
  }

  // @SubscribeMessage('joinRoom')
  // handleJoinRoom(client: any, room: string): void {
  //   client.join(room);
  //   this.server.to(room).emit('message', 'A new user has joined the room.');
  // }

  @SubscribeMessage('typing')
  async typing (@MessageBody('isTyping') isTyping: boolean,
  @ConnectedSocket() client: Socket) {
    const name = await this.messagesService.getClientName(client.id);
    const room = await this.messagesService.getClientRoom(client.id)
    client.in(room).emit('typing', {name, isTyping});
  }

  @SubscribeMessage('rooms')
  rooms() {
    return ['room-1', 'room-2', 'room-3'];
  }
}
