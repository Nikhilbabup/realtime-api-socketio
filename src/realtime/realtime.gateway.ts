import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { log } from 'console';

@WebSocketGateway({ cors: true })
export class RealtimeGateway {
  @WebSocketServer() server: Server;
  private connectedUsers: Map<string, string> = new Map(); // Map socketId to userId

  constructor(private readonly authService: AuthService) {}
  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authorization;
    const user = this.authService.validateToken(token);
    log(user);
    if (!user) {
      client.disconnect();
      return;
    }

    client.data.user = user;
    this.connectedUsers.set(client.id, user.id);
    console.log(`Client connected: ${user.username}`);
  }

  handleDisconnect(client: Socket) {
    this.connectedUsers.delete(client.id);
    console.log(`Client disconnected: ${client.data.user?.username}`);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): void {
    console.log(`Message from ${client.data.user.username}:`, payload);
    this.server.emit('message', payload);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string): void {
    client.join(room);
    console.log('hello');

    client.emit('joinedRoom', room);
    this.server
      .to(room)
      .emit('user joined', `${client.id} joined room: ${room}`);
  }

  @SubscribeMessage('messageToRoom')
  handleMessageToRoom(client: Socket, payload: string): void {
    try {
      const data = JSON.parse(payload);
      const { room, message } = data;
      this.server
        .to(room)
        .emit('messageFromRoom', { user: client.data.user.username, message });
    } catch (error) {
      console.log(`There is an error sending message ${error.message}`);
    }
  }

  @SubscribeMessage('updateResource')
  handleUpdateResource(client: Socket, resource: any): void {
    this.server.emit('resourceUpdated', resource);
  }
}
