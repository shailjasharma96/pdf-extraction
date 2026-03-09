import { Module } from "@nestjs/common";
import { TransactionController } from "./transactions.controller";
import { TransactionService } from "./service";
import { OcrService } from "./ocr.service";
import { PdfParserService } from "./parser";

@Module({
  controllers: [TransactionController],
  providers: [TransactionService, OcrService, PdfParserService],
})
export class TransactionsModule { }