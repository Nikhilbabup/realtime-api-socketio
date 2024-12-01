import { Module } from '@nestjs/common';
import { RealtimeGateway } from './realtime.gateway';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [],
  providers: [RealtimeGateway],
})
export class GatewayModule {}
