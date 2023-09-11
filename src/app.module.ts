import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PoolService } from './pool/pool.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, PoolService],
})
export class AppModule {}
