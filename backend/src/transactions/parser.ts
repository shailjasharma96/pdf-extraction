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
  partyName?: string;
  buyerName?: string;
  sellerName?: string;
};

export async function parsePDF(buffer: Buffer): Promise<ParsedTransaction[]> {
  const pdf = require("pdf-parse");
  const data = await pdf(buffer);
  const text = data.text || "";
  
  // Refined extraction logic based on the requested Tamil EC PDF layout headers visible in screenshot
  const documentType = text.match(/Certificate\s*of\s*Encumbrance/i)?.[1]?.trim() || "Encumbrance Certificate (EC)";
  const department = text.match(/GOVERNMENT\s*OF\s*TAMILNADU/i) ? "Registration Department, Government of Tamil Nadu" : "";
  
  const searchPeriod = text.match(/Period\s*[:\s]*([0-9]{2}[-\/ ][A-Za-z]{3}[-\/ ][0-9]{4}\s*–?\s*[0-9]{2}[-\/ ][A-Za-z]{3}[-\/ ][0-9]{4})/i)?.[1]?.trim() || 
                       text.match(/Period\s*[:\s]*([^\n,]+)/i)?.[1]?.trim();
  const subRegistrarOffice = text.match(/Registered\s*SRO[:\s]*([^\n,]+)/i)?.[1]?.trim() || text.match(/SRO\s*[:\s]*([^\n,]+)/i)?.[1]?.trim();
  const surveyNumbers = text.match(/Survey\s*No\.?\s*[:\s]*([0-9A-Za-z\s\/,]+)/i)?.[1]?.trim();
  const houseNumber = text.match(/House\s*No\.?\s*[:\s]*([0-9\-\/A-Za-z\s]+)/i)?.[1]?.trim();
  const propertyType = text.match(/Property\s*Type[:\s]*([^\n]+)/i)?.[1]?.trim();
  const village = text.match(/Village[:\s]*([^\n]+)/i)?.[1]?.trim();
  const recordedTransaction = text.match(/Sale\s*Deed/i) ? "Sale Deed" : text.match(/Recorded\s*Transaction[:\s]*([^\n]+)/i)?.[1]?.trim();
  const documentNumber = text.match(/doc\.\s*No\.?\s*([0-9\/\s]+)/i)?.[1]?.trim() || text.match(/Document\s*Number[:\s]*([^\n]+)/i)?.[1]?.trim();
  const registeredDate = text.match(/dated\s*([0-9]{2}[A-Za-z]{3}[0-9]{4})/i)?.[1]?.trim() || text.match(/Registered\s*Date[:\s]*([^\n]+)/i)?.[1]?.trim();
  const partyName = text.match(/Mortgagor\s*Name[:\s]*([^\n]+)/i)?.[1]?.trim() || text.match(/Party\s*Name[:\s]*([^\n]+)/i)?.[1]?.trim();
  
  // Buyer/Seller mappings for search consistency
  const buyerName = text.match(/Claimant\s*[:\s]*([^\n]+)/i)?.[1]?.trim() || text.match(/Buyer\s*[:\s]*([^\n]+)/i)?.[1]?.trim() || partyName;
  const sellerName = text.match(/Executant\s*[:\s]*([^\n]+)/i)?.[1]?.trim() || text.match(/Seller\s*[:\s]*([^\n]+)/i)?.[1]?.trim();

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
    partyName,
    buyerName,
    sellerName,
  };

  return [record];
}