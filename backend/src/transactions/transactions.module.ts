import { Module } from "@nestjs/common";
import { TransactionController } from "./transactions.controller";
import { TransactionService } from "./service";

@Module({
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionsModule {}