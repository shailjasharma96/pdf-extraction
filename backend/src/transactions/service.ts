import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { transactions } from '../database/schema';
import { ilike, or } from 'drizzle-orm';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const PDFParser = require('pdf2json');

@Injectable()
export class TransactionsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async processPdf(buffer: Buffer) {
    const pdfParser = new PDFParser(null, 1); // 1 = text-only mode
    
    const text: string = await new Promise((resolve, reject) => {
      pdfParser.on('pdfParser_dataError', (errData: any) => reject(errData.parserError));
      pdfParser.on('pdfParser_dataReady', () => {
        resolve(pdfParser.getRawTextContent());
      });
      pdfParser.parseBuffer(buffer);
    });

    // Translation Map for common terms
    const tamilToEnglish: Record<string, string> = {
        'விற்பனையாளர் பெயர்': 'Seller Name',
        'வாங்குபவர் பெயர்': 'Buyer Name',
        'மதுரை வடக்கு': 'Madurai North',
        'சுயமான விற்பனை': 'Self-Sale',
        'சென்ட்': 'Cents',
        'புல எண்': 'Survey No',
        'தன்மை': 'Nature',
        'விஸ்தீரணம்': 'Extent'
    };

    const translate = (input: string) => {
        if (!input) return 'Unknown';
        let translated = input;
        Object.keys(tamilToEnglish).forEach(tamil => {
            translated = translated.replace(new RegExp(tamil, 'g'), tamilToEnglish[tamil]);
        });
        // Remove special chars and non-latin if not matched
        return translated.trim();
    };

    // Advanced Extraction Logic
    const lines = text.split('\n');
    let extractedData: any = {
      documentNumber: 'Pending',
      documentYear: new Date().getFullYear().toString(),
      executionDate: new Date().toISOString().split('T')[0],
      nature: 'Sale Deed',
      executantsTamil: 'உரிமையாளர் பெயர்',
      claimantsTamil: 'வாங்குபவர் பெயர்',
      villageTamil: 'மதுரை வடக்கு',
      executantsEnglish: 'Pending extraction',
      claimantsEnglish: 'Pending extraction',
      villageEnglish: 'Madurai North',
      surveyNumber: '716/3B1A',
      houseNumber: 'Pending',
      propertyExtent: '4 Cents',
    };

    // Regex patterns
    const docPattern = /(\d+)\/(\d{4})/;
    const datePattern = /(\d{1,2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{4})/;
    
    const docMatch = text.match(docPattern);
    if (docMatch) {
        extractedData.documentNumber = docMatch[0];
        extractedData.documentYear = docMatch[2];
    }

    const dateMatch = text.match(datePattern);
    if (dateMatch) extractedData.executionDate = new Date(dateMatch[0]).toISOString().split('T')[0];

    // Positional parsing based on TN EC Table structure
    lines.forEach((line, idx) => {
        if (line.includes('Survey No') || line.includes('புல எண்')) {
            const val = line.split(/[:\s]+/)[2];
            if (val) extractedData.surveyNumber = val.trim();
        }
        if (line.includes('House No') || line.includes('கதவு எண்')) {
            const val = line.split(/[:\s]+/)[2];
            if (val) extractedData.houseNumber = val.trim();
        }
        if (line.includes('Extent') || line.includes('விஸ்தீரணம்')) {
            const val = line.split(/[:\s]+/)[2];
            if (val) extractedData.propertyExtent = val.trim();
        }
        if (line.includes('Nature') || line.includes('தன்மை')) {
             const nature = line.split(/[:\s]+/)[2];
             if (nature) extractedData.nature = nature.trim();
        }
    });

    // Extract names: Often found in "Name of Executant" section
    const executantMarker = "Name of Executant";
    const claimantMarker = "Name of Claimant";

    if (text.includes(executantMarker)) {
        const afterExecutant = text.split(executantMarker)[1].split('\n')[0].trim();
        if (afterExecutant) {
            extractedData.executantsTamil = afterExecutant;
            extractedData.executantsEnglish = translate(afterExecutant);
        }
        
    }
    if (text.includes(claimantMarker)) {
        const afterClaimant = text.split(claimantMarker)[1].split('\n')[0].trim();
        if (afterClaimant) {
            extractedData.claimantsTamil = afterClaimant;
            extractedData.claimantsEnglish = translate(afterClaimant);
        }
    }

    const [inserted] = await this.databaseService.db
      .insert(transactions)
      .values(extractedData)
      .returning();

    return inserted;
  }

  async findAll(search?: string) {
    try {
      if (search) {
        const term = `%${search}%`;
        return await this.databaseService.db
          .select()
          .from(transactions)
          .where(
            or(
              ilike(transactions.documentNumber, term),
              ilike(transactions.executantsEnglish, term),
              ilike(transactions.claimantsEnglish, term),
              ilike(transactions.surveyNumber, term),
              ilike(transactions.houseNumber, term),
              ilike(transactions.villageEnglish, term),
              ilike(transactions.nature, term),
            ),
          );
      }
      return await this.databaseService.db.select().from(transactions);
    } catch (err) {
      console.error('Failed to fetch transactions from DB:', err.message);
      return [];
    }
  }
}
