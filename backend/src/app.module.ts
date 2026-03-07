import { Module } from '@nestjs/common';
import { TransactionController } from './transactions/transactions.controller';
import { TransactionService } from './transactions/service';

@Module({
  imports: [],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class AppModule {}