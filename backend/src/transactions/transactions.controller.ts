import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
  Query,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { TransactionService } from "./service";

@Controller("transactions")
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("pdf"))
  async upload(@UploadedFile() file: Express.Multer.File) {
    return this.transactionService.processPDF(file);
  }

  @Get()
  async getTransactions(
    @Query("buyerName") buyerName?: string,
    @Query("sellerName") sellerName?: string,
    @Query("houseNumber") houseNumber?: string,
    @Query("documentNumber") documentNumber?: string,
    @Query("surveyNumbers") surveyNumbers?: string,
    @Query("village") village?: string,
    @Query("partyName") partyName?: string,
    @Query("limit") limit?: string
  ) {
    return this.transactionService.getTransactions({
      buyerName,
      sellerName,
      houseNumber,
      documentNumber,
      surveyNumbers,
      village,
      partyName,
      limit: limit ? parseInt(limit, 10) : undefined
    });
  }
}