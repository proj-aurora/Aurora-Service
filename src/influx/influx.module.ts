import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { InfluxDBService, InfluxDB } from './influx.service';
import { InfluxDB as InfluxDBClient } from '@influxdata/influxdb-client';
import { EventGateway } from "./socket";
import { InfluxController } from "./influx.controller";

const influxProvider = {
  provide: InfluxDB,
  useFactory: async (configService: ConfigService) => {
    const url = configService.get<string>('INFLUXDB_URL');
    const token = configService.get<string>('INFLUXDB_TOKEN');
    const client = new InfluxDBClient({ url, token });

    return client;
  },
  inject: [ConfigService],
};

@Module({
  imports: [ConfigModule],
  controllers: [InfluxController],
  providers: [influxProvider, InfluxDBService, EventGateway],
  exports: [InfluxDBService],
})
export class InfluxDBModule {}
