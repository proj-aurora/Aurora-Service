import { Body, Controller, Post } from "@nestjs/common";
import { InfluxDBService } from "./influx.service";
import { MessagePattern } from "@nestjs/microservices";

@Controller('influx')
export class InfluxController {

  constructor(private influxDBService: InfluxDBService) {}

  @MessagePattern({ check: 'cpu' })
  async getInflux(@Body() data: {start: string, stop: string, key: string, windowPeriod: string}){
    const { start, stop, key, windowPeriod } = data;
    return this.influxDBService.getCpu(start, stop, key, windowPeriod);
  }

  @MessagePattern({ check: 'disk' })
  async getDisk(@Body() data: {start: string, stop: string, key: string, windowPeriod: string}){
    const { start, stop, key, windowPeriod } = data;
    return this.influxDBService.getDisk(start, stop, key, windowPeriod);
  }

  @MessagePattern({ check: 'memory' })
  async getMemory(@Body() data: {start: string, stop: string, key: string, windowPeriod: string}){
    const { start, stop, key, windowPeriod } = data;
    return this.influxDBService.getMemory(start, stop, key, windowPeriod);
  }

  @MessagePattern({ check: 'swap' })
  async getSwap(@Body() data: {start: string, stop: string, key: string, windowPeriod: string}){
    const { start, stop, key, windowPeriod } = data;
    return this.influxDBService.getSwap(start, stop, key, windowPeriod);
  }

  @MessagePattern({ check: 'overview' })
  async getOverview(@Body() data: {start: string, stop: string, key: string, windowPeriod: string}){
    const { start, stop, key, windowPeriod } = data;
    return this.influxDBService.getAll(start, stop, key, windowPeriod);
  }

}