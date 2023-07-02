import {Module} from "@nestjs/common";
import {AuthController} from "./auth.controller";
import {EmailService} from "./email.service";
import {ConfigModule} from "@nestjs/config";

@Module({
    imports: [
      ConfigModule.forRoot(),
    ],
    controllers: [AuthController],
    providers: [EmailService],
})
export class AuthModule {}