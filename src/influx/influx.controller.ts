import { Body, Controller, Post } from "@nestjs/common";
import { InfluxDBService } from "./influx.service";
import { MessagePattern } from "@nestjs/microservices";

@Controller('influx')
export class InfluxController {

  constructor(private influxDBService: InfluxDBService) {}

  @MessagePattern({ check: 'get' })
  async getInflux(@Body() data: {start: string, stop: string, windowPeriod: string}){
    const { start, stop, windowPeriod } = data;
    return this.influxDBService.getData(start, stop, windowPeriod);
  }
}