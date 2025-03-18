import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { HealthController } from "./health/health.controller";

@Module({
  imports: [DatabaseModule, UsersModule, AuthModule],
  controllers: [HealthController],
})
export class AppModule {}
