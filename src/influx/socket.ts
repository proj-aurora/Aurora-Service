import {
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect, SubscribeMessage, MessageBody
} from "@nestjs/websockets";
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { InfluxDBService } from './influx.service';

@WebSocketGateway(8080, { transports: ['websocket'] })
export class EventGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger('EventGateway');

  @WebSocketServer() server: Server;

  constructor(private readonly influxDBService: InfluxDBService) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Initialized!');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('test')
  async handleMessage(@MessageBody() data) {
    console.log(data);
    this.server.emit('server', data);
  }

  @SubscribeMessage('influx')
  async handleInflux(@MessageBody() data: {start: string, stop: string, windowPeriod: string}, client: Socket): Promise<any> {
    client.emit('events', 'test');
    setInterval(async () => {
      const influxData = await this.influxDBService.getData(data.start, data.stop, data.windowPeriod);
      client.emit('events', influxData);
      this.server.emit('events', influxData);
    }, 5000); // Set interval as needed
  }
}
