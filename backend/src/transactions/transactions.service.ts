import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { transactions } from '../db/schema';
import { ilike, or } from 'drizzle-orm';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdf = require('pdf-parse');

@Injectable()
export class TransactionsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async processPdf(buffer: Buffer) {
    const data = await pdf(buffer);
    const text = data.text;

    // TODO: Send extracted text to LLM (e.g., Gemini) for structured parsing and translation
    // For now, we'll log the text and return a placeholder
    console.log('Extracted Text:', text);

    // Placeholder for parsed data from LLM
    const mockTransaction = {
      documentNumber: '1234/2024',
      documentYear: '2024',
      executionDate: new Date().toISOString(),
      nature: 'Sale Deed',
      executantsTamil: 'தமிழ் விற்பனையாளர்',
      claimantsTamil: 'தமிழ் வாங்குபவர்',
      villageTamil: 'மதுரை',
      executantsEnglish: 'Tamil Seller',
      claimantsEnglish: 'Tamil Buyer',
      villageEnglish: 'Madurai',
      surveyNumber: '716/3B1A',
      propertyExtent: '4.0 CENTS',
    };

    const [inserted] = await this.databaseService.db
      .insert(transactions)
      .values(mockTransaction)
      .returning();

    return inserted;
  }

  async findAll(search?: string) {
    if (search) {
      return this.databaseService.db
        .select()
        .from(transactions)
        .where(
          or(
            ilike(transactions.documentNumber, `%${search}%`),
            ilike(transactions.executantsEnglish, `%${search}%`),
            ilike(transactions.claimantsEnglish, `%${search}%`),
          ),
        );
    }
    return this.databaseService.db.select().from(transactions);
  }
}
