import { Injectable, Inject } from '@nestjs/common';
import { InfluxDB as InfluxDBClient } from '@influxdata/influxdb-client';

export const InfluxDB = 'InfluxDB';

@Injectable()
export class InfluxDBService {
  constructor(
    @Inject(InfluxDB) private readonly influxDBClient: InfluxDBClient,
  ) {}

  async getData(start: string, stop: string, windowPeriod: string) {
    // I've provided default values here. Adjust as needed.
    const queryApi = this.influxDBClient.getQueryApi('aurora');

    const fluxQuery =
      `from(bucket: "auroraTest") ` +
      `|> range(start: ${start}, stop: ${stop}) ` +
      `|> filter(fn: (r) => r["_measurement"] == "cpu") ` +
      `|> filter(fn: (r) => r["_field"] == "CpuPercent") ` +
      `|> filter(fn: (r) => r["key"] == "AURORA_TEST") ` +
      `|> aggregateWindow(every: ${windowPeriod}, fn: mean, createEmpty: false) ` +
      `|> yield(name: "mean")`;

    const result = [];

    return new Promise((resolve, reject) => {
      queryApi.queryRows(fluxQuery, {
        next(row, tableMeta) {
          const o = tableMeta.toObject(row);
          result.push(o);
        },
        error(error) {
          reject(error);
        },
        complete() {
          resolve(result);
        },
      });
    });
  }
}
