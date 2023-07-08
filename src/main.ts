import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from "@nestjs/config";
import { Transport } from "@nestjs/microservices";

function location_aurora(port: string): string {
  return port.slice(0, 2)+'.'+port.slice(2)
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService);
  const port = configService.get('AURORA_PORT');

  const microservice = app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: configService.get('MICROSERVICE_HOST'),
      port: configService.get('MICROSERVICE_PORT'),
    }
  });

  await app.startAllMicroservices();
  await app.listen(port)
  console.log('You can see the Aurora at '+location_aurora(port)+' degrees north latitude.');
}
bootstrap().then(() => console.log());