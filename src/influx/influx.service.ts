import { Injectable, Inject } from '@nestjs/common';
import { InfluxDB as InfluxDBClient } from '@influxdata/influxdb-client';

export const InfluxDB = 'InfluxDB';

@Injectable()
export class InfluxDBService {
  constructor(
    @Inject(InfluxDB) private readonly influxDBClient: InfluxDBClient,
  ) {}

  async getCpu(start: string, stop: string, key: string, windowPeriod: string) {
    const cpu = this.influxDBClient.getQueryApi('aurora');

    const fluxQuery =
      `from(bucket: "auroraTest") ` +
      `|> range(start: ${start}, stop: ${stop}) ` +
      `|> filter(fn: (r) => r["_measurement"] == "cpu") ` +
      `|> filter(fn: (r) => r["_field"] == "CpuPercent" or r["_field"] == "SystemPercent" or r["_field"] == "UserPercent") ` +
      `|> filter(fn: (r) => r["key"] == "${key}") ` +
      `|> aggregateWindow(every: ${windowPeriod}, fn: mean, createEmpty: false) ` +
      `|> yield(name: "mean")`;

    const result = [];

    return new Promise((resolve, reject) => {
      cpu.queryRows(fluxQuery, {
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

  async getDisk(start: string, stop: string, key: string, windowPeriod: string) {
    const disk = this.influxDBClient.getQueryApi('aurora');

    const fluxQuery =
      `from(bucket: "auroraTest") ` +
      `|> range(start: ${start}, stop: ${stop}) ` +
      `|> filter(fn: (r) => r["_measurement"] == "disk") ` +
      `|> filter(fn: (r) => r["_field"] == "ReadSize" or r["_field"] == "WriteSize") ` +
      `|> filter(fn: (r) => r["key"] == "${key}") ` +
      `|> aggregateWindow(every: ${windowPeriod}, fn: mean, createEmpty: false) ` +
      `|> yield(name: "mean")`;

    const result = [];

    return new Promise((resolve, reject) => {
      disk.queryRows(fluxQuery, {
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

  async getMemory(start: string, stop: string, key: string, windowPeriod: string) {
    const memory = this.influxDBClient.getQueryApi('aurora');

    const fluxQuery =
      `from(bucket: "auroraTest") ` +
      `|> range(start: ${start}, stop: ${stop}) ` +
      `|> filter(fn: (r) => r["_measurement"] == "memory") ` +
      `|> filter(fn: (r) => r["_field"] == "MemoryFree" or r["_field"] == "MemoryTotal" or r["_field"] == "MemoryUsed") ` +
      `|> filter(fn: (r) => r["key"] == "${key}") ` +
      `|> aggregateWindow(every: ${windowPeriod}, fn: mean, createEmpty: false) ` +
      `|> yield(name: "mean")`;

    const result = [];

    return new Promise((resolve, reject) => {
      memory.queryRows(fluxQuery, {
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

  async getSwap(start: string, stop: string, key: string, windowPeriod: string) {
    const swap = this.influxDBClient.getQueryApi('aurora');

    const fluxQuery =
      `from(bucket: "auroraTest") ` +
      `|> range(start: ${start}, stop: ${stop}) ` +
      `|> filter(fn: (r) => r["_measurement"] == "memory") ` +
      `|> filter(fn: (r) => r["_field"] == "SwapFree" or r["_field"] == "SwapTotal" or r["_field"] == "SwapUsed") ` +
      `|> filter(fn: (r) => r["key"] == "${key}") ` +
      `|> aggregateWindow(every: ${windowPeriod}, fn: mean, createEmpty: false) ` +
      `|> yield(name: "mean")`;

    const result = [];

    return new Promise((resolve, reject) => {
      swap.queryRows(fluxQuery, {
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
