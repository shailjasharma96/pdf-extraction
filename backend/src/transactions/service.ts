import { Injectable } from "@nestjs/common";
import { db } from "../database/drizzle";
import { transactions } from "../database/schema";
import { ilike, and } from "drizzle-orm";
import { parsePDF } from "./parser";
import { translateTamilText } from "./translator";

@Injectable()
export class TransactionService {
  async processPDF(file: Express.Multer.File) {
    console.log("Received file for processing:", file.originalname);
    try {
      const parsed = await parsePDF(file.buffer);
      console.log("Parsed PDF content:", parsed);

      const translated = await Promise.all(
        parsed.map(async (item) => ({
          ...item,
          partyName: await translateTamilText(item.partyName),
          village: await translateTamilText(item.village),
          recordedTransaction: await translateTamilText(item.recordedTransaction),
          propertyType: await translateTamilText(item.propertyType),
        }))
      );
      console.log("Translated content:", translated);

      const inserted = await db.insert(transactions).values(translated).returning();
      console.log("Inserted into DB:", inserted);
      return inserted;
    } catch (err) {
      console.error("Error in processPDF:", err);
      throw err;
    }
  }

  async getTransactions(filters: {
    buyerName?: string;
    sellerName?: string;
    houseNumber?: string;
    surveyNumbers?: string;
    documentNumber?: string;
    partyName?: string;
    village?: string;
  }) {
    const conditions = [];

    if (filters.buyerName) {
      conditions.push(ilike(transactions.buyerName, `%${filters.buyerName}%`));
    }

    if (filters.sellerName) {
      conditions.push(ilike(transactions.sellerName, `%${filters.sellerName}%`));
    }

    if (filters.houseNumber) {
      conditions.push(ilike(transactions.houseNumber, `%${filters.houseNumber}%`));
    }

    if (filters.surveyNumbers) {
      conditions.push(ilike(transactions.surveyNumbers, `%${filters.surveyNumbers}%`));
    }

    if (filters.documentNumber) {
      conditions.push(ilike(transactions.documentNumber, `%${filters.documentNumber}%`));
    }

    if (filters.partyName) {
      conditions.push(ilike(transactions.partyName, `%${filters.partyName}%`));
    }

    if (filters.village) {
      conditions.push(ilike(transactions.village, `%${filters.village}%`));
    }

    return db
      .select()
      .from(transactions)
      .where(conditions.length ? and(...conditions) : undefined);
  }
}