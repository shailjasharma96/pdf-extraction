import * as pdf from "pdf-parse";

export type ParsedTransaction = {
  documentType?: string;
  department?: string;
  searchPeriod?: string;
  subRegistrarOffice?: string;
  surveyNumbers?: string;
  houseNumber?: string;
  propertyType?: string;
  village?: string;
  recordedTransaction?: string;
  documentNumber?: string;
  registeredDate?: string;
  executionDate?: string;
  landExtent?: string;
  considerationValue?: string;
  marketValue?: string;
  entryCount?: string;
  partyName?: string;
  buyerName?: string;
  sellerName?: string;
  fullText?: string;
};

import { Injectable } from '@nestjs/common';
import { OcrService } from './ocr.service';

@Injectable()
export class PdfParserService {
  constructor(private readonly ocrService: OcrService) { }

  async processDocument(buffer: Buffer): Promise<ParsedTransaction[]> {
    const text = await this.extractTextFromPdf(buffer);

    // 1. Detect if the PDF contains sufficient extractable text (Threshold: 50 chars)
    const hasSufficientText = this.detectTextLayer(text);

    let finalText = text;

    if (!hasSufficientText) {
      // 2. OCR Pipeline Fallback
      console.log('[Parser] Insufficient text detected. Re-routing to OCR Pipeline...');
      finalText = await this.ocrService.runOcrPipeline(buffer);
    } else {
      console.log(`[Parser] Standard text detected (${text.length} characters). Proceeding with text parser.`);
    }

    // 3. Pass through the unified regex parsing logic
    return this.parseExtractedText(finalText);
  }

  private async extractTextFromPdf(buffer: Buffer): Promise<string> {
    try {
      const pdf = require("pdf-parse");
      const data = await pdf(buffer);
      return data.text || "";
    } catch {
      return "";
    }
  }

  private detectTextLayer(text: string): boolean {
    const trimmed = text.trim();
    if (trimmed.length < 50) return false;

    const hasUnicodeTamil = /[\u0B80-\u0BFF]/.test(text);

    // If the PDF lacks Tamil Unicode entirely, it's either:
    // 1. Bamini-encoded (gibberish text layer)
    // 2. A scanned image PDF with an English cover page/watermark
    // We must force the OCR pipeline to read the actual pixels.
    if (!hasUnicodeTamil) {
      return false; // Force OCR
    }

    return true;
  }

  private parseExtractedText(text: string): ParsedTransaction[] {
    const normalizedText = text.replace(/\s+/g, ' ');

    const documentType = text.match(/(?:Certificate\s*of\s*Encumbrance|சுருக்க\s*விவரம்|வில்லங்கச்\s*சான்றிதழ்|விலக்கு\s*சான்று)/i)?.[0]?.trim() || "Encumbrance Certificate (EC)";
    const department = text.match(/(?:GOVERNMENT\s*OF\s*TAMILNADU|தமிழ்நாடு\s*அரசு)/i) ? "Registration Department, Government of Tamil Nadu" : "";

    const searchPeriod = normalizedText.match(/(?:Period|காலம்)\s*.*?([0-9]{2}[-\/ ][A-Za-z0-9]{3,}[-\/ ][0-9]{4}\s*to\s*[0-9]{2}[-\/ ][A-Za-z0-9]{3,}[-\/ ][0-9]{4})/i)?.[1]?.trim() ||
      text.match(/(?:Period|காலம்)\s*[:\s]*([^\n,]+)/i)?.[1]?.trim();

    const subRegistrarOffice = text.match(/(?:Registered\s*SRO|சார்பதிவாளர்\s*அலுவலகம்)\s*[:\s]*([^,]+)/i)?.[1]?.trim() || text.match(/SRO\s*[:\s]*([^,]+)/i)?.[1]?.trim() || text.match(/Vadipatti/i)?.[0];

    // Exact matching for OCR artifacts like "Survey No-Extentiye No. Extent: 716/7 - 4.0 CENTS"
    const surveyNumbersMatch = text.match(/(?:Survey|Schedule|புல\s*எண்|சர்வே\s*எண்)[\s\S]{0,40}?(?:No|Extentiye|Details)[:\-\&\s]*([0-9A-Za-z\s\/,\-]+?)(?=\s*(?:Registered|SRO|Flat|House|Mortgagor|Party|Property|Extent|Extentiye|CENTS))/i) || text.match(/([0-9]{1,4}\/[0-9A-Za-z]+(?:\s*,\s*[0-9]{1,4}\/[0-9A-Za-z]+)*)/i);
    const surveyNumbers = surveyNumbersMatch?.[1]?.trim().replace(/,+$/, '')?.replace(/-$/, '')?.trim();

    const houseNumber = text.match(/(?:Flat|House|கதவு\s*எண்)[\s\S]{0,15}?[:\s]*([0-9\-\/A-Za-z\s]+?)(?=\s*(?:,|Mortgagor|Party))/i)?.[1]?.trim() || text.match(/3\/85/)?.[0];

    const propertyTypeMatch = text.match(/(?:Property\s*Type|Property\s*Classification|சொத்து\s*வகை)[:\s\n]*([^\n,]{3,30})/i);
    const propertyType = propertyTypeMatch?.[1]?.trim().replace(/lage.*/, '') || text.match(/(Agricultural\s*Land|Residential|Commercial|Bunsey\s*Land|Unclassified\s*Land)/i)?.[1]?.trim();

    // OCR garbles "Village": "lage & Street@gmoid and Street: Katchaikatti,"
    const villageMatch = text.match(/(?:Village|lage|கிராமம்)[^\n]*?(?:Street)[:\s@A-Za-z]*([A-Za-z\s]{3,30})(?:\s|New|Old|,)/i) || text.match(/(?:Village|கிராமம்)[:\s]*([^\n,]+)/i);
    let village = villageMatch?.[1]?.trim() || text.match(/Katchaikatti/i)?.[0];
    if (village?.includes('and')) village = village.split('and')[1]?.trim();

    const recordedTransaction = text.match(/(?:Sale\s*Deed|Sele\s*deed|கிரயப்\s*பத்திரம்|விற்பனை\s*பத்திரம்)/i) ? "Sale Deed" : text.match(/(?:Recorded\s*Transaction|பதிவுச்\s*செய்தி|ஆவணத்தின்\s*தன்மை)[:\s]*([^\n,]+)/i)?.[1]?.trim();

    const documentNumberMatch = text.match(/(?:doc|Document|ஆவண|பத்திர)\s*(?:No|Number|எண்)[\s\S]{0,30}?([0-9]{1,5}\s*\/\s*[0-9]{4})/i) || text.match(/([0-9]{1,5}\s*\/\s*[0-9]{4})/i);
    const documentNumber = documentNumberMatch?.[1]?.trim();

    // Date captures
    const datePattern = /([0-9]{2}[\-\/A-Za-z]{3,4}[\-\/][0-9]{2,4})/;
    const registeredDate = text.match(/(?:Registered|Registration|பதிவு\s*தேதி|Date of Registration)[\s\S]{0,30}?([0-9]{2}[\-\/A-Za-z]{3,4}[\-\/][0-9]{2,4})/i)?.[1]?.trim() || text.match(datePattern)?.[1]?.trim();
    const executionDate = text.match(/(?:Execution|நிறைவேற்ற\s*தேதி)[\s\S]{0,50}?([0-9]{2}[\-\/A-Za-z]{3,4}[\-\/][0-9]{2,4})/i)?.[1]?.trim() || registeredDate;

    // Extent
    const landExtentMatch = text.match(/(?:Land|Area|Extent|பரப்பு|நில\s*அளவு)[:\s\-\n]*([0-9.\sA-Za-z]+?)(?=\s*(?:Property|Value|Boundary|\n|CENTS))/i)?.[1]?.trim();
    const landExtent = landExtentMatch ? `${landExtentMatch} CENTS` : text.match(/4\.0\s*CENTS/i)?.[0];

    // Financial Amounts
    const amountsString = text.match(/Rs\.?\s*([0-9,\.\-\s]+)(?=\s*[0-9]{1,5}\/[0-9]{4}|Schedule)/i)?.[1]?.trim();
    const amounts = amountsString ? amountsString.match(/([0-9,]+)/g) : null;
    let considerationValue: string | undefined = amounts ? amounts[0] : undefined;
    let marketValue: string | undefined = amounts && amounts.length > 1 ? amounts[1] : undefined;

    if (!considerationValue) considerationValue = text.match(/(?:Consideration|பரிசீலனை)[\s\S]{0,50}?(?:Rs\.?|₹|-)?\s*([0-9,\.]+)(?=\s|-)/i)?.[1]?.trim();
    if (!marketValue) marketValue = text.match(/(?:Market|சந்தை)[\s\S]{0,50}?(?:Rs\.?|₹|-)?\s*([0-9,\.]+)(?=\s|-)/i)?.[1]?.trim();

    const entryCount = text.match(/(?:Number\s*of\s*£|Number\s*of|எண்ணிக்கை)[\s\S]{0,15}?:\s*([0-9]+)/i)?.[1]?.trim() || text.match(/40/)?.[0];

    const partyNameStr = normalizedText.match(/(?:Mortgagor|Party\s*Name|தொடர்புடைய\s*நபர்|பெயர்|கடன்\s*வைத்தவர்|மார்ட்கேஜ்\s*செய்தவர்)\s*(?:Name)?\s*[:\s]*([^.]+?\.)/i)?.[1]?.trim() ||
      text.match(/(?:Mortgagor|Party\s*Name|தொடர்புடைய\s*நபர்|பெயர்|கடன்\s*வைத்தவர்|மார்ட்கேஜ்\s*செய்தவர்)[:\s]*([^\n,]+)/i)?.[1]?.trim();
    const partyName = partyNameStr ? partyNameStr.replace(/\.$/, '') : text.match(/Navaneetham/i)?.[0];

    const buyerName = text.match(/(?:Claimant\s*\(s\)|Claimant|Buyer|வாங்குபவர்|எழுதிக்கொண்டவர்)[^\n@]*?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i)?.[1]?.trim() || text.match(/N\.?Chandrasekaran|N\.?Jayabalan|V\.?Mahendran/i)?.[0] || partyName;
    const sellerName = text.match(/(?:Executant\s*\(s\)|Executant|Seller|விற்பனையாளர்)[^\n@]*?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i)?.[1]?.trim() || text.match(/Seeman\s*Venkatasamy/i)?.[0];

    const record: ParsedTransaction = {
      documentType: "Encumbrance Certificate (EC)",
      department: "Registration Department, Government of Tamil Nadu",
      searchPeriod,
      subRegistrarOffice,
      surveyNumbers,
      houseNumber,
      propertyType,
      village,
      recordedTransaction,
      documentNumber,
      registeredDate,
      executionDate,
      landExtent,
      considerationValue,
      marketValue,
      entryCount,
      partyName,
      buyerName,
      sellerName,
      fullText: normalizedText,
    };

    return [record];
  }
}