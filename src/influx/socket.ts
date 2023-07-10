import {
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect, SubscribeMessage, MessageBody
} from "@nestjs/websockets";
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'ws';
import { InfluxDBService } from './influx.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger('EventGateway');

  @WebSocketServer() server: Server;

  // Track all connected clients
  private clients: Set<Socket> = new Set();

  constructor(private readonly influxDBService: InfluxDBService) {}

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

  @SubscribeMessage('test')
  async handleMessage(@MessageBody() data, client: Socket) {
    console.log(data);
    // client.send(JSON.stringify({ event: 'server', data }));
    this.server.emit('server', data);
    return data;
  }

  @SubscribeMessage('influx')
  async handleInflux(@MessageBody() data: {start: string, stop: string, windowPeriod: string}, client: Socket): Promise<any> {
    // client.send(JSON.stringify({ event: 'events', data: 'test' }));
    console.log(data)
    const influxData = await this.influxDBService.getData(data.start, data.stop, data.windowPeriod);
    console.log(influxData)
    // Emit to each connected client
    return await influxData
  }
}
