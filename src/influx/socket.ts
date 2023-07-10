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

  @SubscribeMessage('cpu')
  async handleCpu(@MessageBody() data: {start: string, stop: string, key: string, windowPeriod: string}, client: Socket): Promise<any> {
    const influxData = await this.influxDBService.getCpu(data.start, data.stop, data.key, data.windowPeriod);
    return await influxData
  }

  @SubscribeMessage('disk')
  async handleDisk(@MessageBody() data: {start: string, stop: string, key: string, windowPeriod: string}, client: Socket): Promise<any> {
    const influxData = await this.influxDBService.getDisk(data.start, data.stop, data.key, data.windowPeriod);
    return await influxData
  }

  @SubscribeMessage('memory')
  async handleMemory(@MessageBody() data: {start: string, stop: string, key: string, windowPeriod: string}, client: Socket): Promise<any> {
    const influxData = await this.influxDBService.getMemory(data.start, data.stop, data.key, data.windowPeriod);
    return await influxData
  }

  @SubscribeMessage('swap')
  async handleSwap(@MessageBody() data: {start: string, stop: string, key: string, windowPeriod: string}, client: Socket): Promise<any> {
    const influxData = await this.influxDBService.getSwap(data.start, data.stop, data.key, data.windowPeriod);
    return await influxData
  }

  @SubscribeMessage('overview')
  async handleAll(@MessageBody() data: {start: string, stop: string, key: string, windowPeriod: string}, client: Socket): Promise<any> {
    const influxData = await this.influxDBService.getAll(data.start, data.stop, data.key, data.windowPeriod);
    return await influxData
  }

}
