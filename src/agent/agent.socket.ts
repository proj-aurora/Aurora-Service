import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import { Logger } from "@nestjs/common";
import { Server, Socket } from "ws";
import { AgentService } from "./agent.service";

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SyslogGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger('EventGateway');

  @WebSocketServer() server: Server;

  // Track all connected clients
  private clients: Set<Socket> = new Set();

  constructor(private readonly agentService: AgentService) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Initialized!');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    // Add newly connected client to the set
    this.clients.add(client);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    // Remove disconnected client from the set
    this.clients.delete(client);
  }

  @SubscribeMessage('syslog')
  async recentData(@MessageBody() data: { key: string, limit: number }, client: Socket) {
    console.log(data)
    const { key, limit } = data;
    return await this.agentService.recentData(key, limit);
  }
}
