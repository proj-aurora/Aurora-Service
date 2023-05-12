import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

function location_aurora(port: string): string {
  return port.slice(0, 2)+'.'+port.slice(2)
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);
  const port = configService.get('AURORA_PORT');

  await app.listen(port, () => {
    console.log('You can see the Aurora at '+location_aurora(port)+' degrees north latitude.');
  })
}
bootstrap()