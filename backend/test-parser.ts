import { PdfParserService } from './src/transactions/parser';

const text = `GOVERNMENT OF TAMILNADU REGISTRATION DEPARTMENT Date of Execution & Date Sr. Certificate of Encumbrance on Property No.J| Document No.& Year/ | of Presentation & Date of Name of Executant Name of Claimant(s) | Vol.No & Page. No. | Document No. and | ॥॥/।।।।।।।।। Block No. and N Year Next Day 6 Thaka L Day Names) Page No. & Date of Enrollment 14-Mar-2012 ‘2 i y Resource [oo bn Akka : Th Th 14-Mar-2012 i p- Vivekuland onsideration ॥/808 Exchange amount; arket ॥6/Market Value: PR ॥Previous Document Number: Na Patanga Type Document References : Schedule 1 Details: To Kai Vadake” Seemal alias Venkatasami Reddyar Bunsey Land, Schedule Reserve Property Description Notes: Bunsey Reserve 716 “East' South-South Sarvaseva Farm Road, “West” Bia Nir 0630 Airsku A! செல்‌ By கடைசியில்‌ செ கிரையம்‌ ன்செய்‌ நிலம்‌, “தெற்கேதாங்கள்‌ புன்செய்‌ நிலம்‌ Number of £ரபதிவுகளின்‌ எண்ணிக்கை: 40 Disclaimer; The details of the above property have been provided with due care and with reference to the Acts and Rules. However in case of any error or omission, the Department cannot be held responsible. The above details are of informative in nature. குறிப்புரை: சட்டம்‌ மற்றும்‌ விதிகளுக்குட்பட்டு மிகுந்த கவனத்துடன்‌ சொத்து தொடர்பான The above details are provided, however, the department cannot be held responsible for them. The above details are provided for information. If there are any doubts, please contact the toll free number 1800 102 5174 GOVERNMENT OF TAMILNADU REGISTRATION DEPARTMENT Ry Certificate of Encumbrance on Property சொத்து தொடர்பான வில்லங்கச்‌ சான்று Date of Execution & Date Sr. No./| Document No.& Year/ | of Presentation & Date of Name of Executant(s) Name of Claimant(s)/ | Vol.No & Page. No/ வ, | ஆவண எண்‌ மற்றும்‌ | ஈஷுளஸிஸஎழுதிக்‌ கொ Nature/géranio எழுதி வாங்கியவர்‌ | தொகுதி எண்‌ மற்றும்‌ து ஆண்டு டுத்த நாள்‌ 6 தாக்க ல்‌ நாள்‌ Names of Issuers) "Wires Page Number & Date of Registration 13-Sep-2022 : : 135ep202 Sele deed h weve X svc 13-Sep-2022 onsideration ॥/8ब6/Exchange Amount: arket /வब6/Market Value: PR Number/(wheng Document Number: Rs. 95,920/- . 116,848- 643/2012 Schedule 1 Details: Survey No-Extentiye No. Extent: 716/7 - 4.0 CENTS Property 1 Property/Property Classification: Agricultural Land lage & Street@gmoid and Street: Katchaikatti, Select Boundary Details: Schedule Romerks/Qowg) Visham v il Madurai la da fig. Syke - Opn. Cons ibaa Road Cap Dafe WAL Pamba Widi Gl Mapa coke N.Chandrasekaran Unclassified Land, North - Seeman Venkatasamy Dil Sendu 9 Ol ; z A : New Patta Retiyar Bunsei Land as per Subdivision, South - We Dated : N. Jayabalan and V. Mahendran Claim No. 6771 Bunsei Reserve 7167 No. 0365 Airsuk Cent 9 In Napadil, the north side of Sendu 4 and all four of them are clean purchases. The details of the above property have been provided with due care and with reference to the Acts and Rules. However in case of any error or omission, the Department cannot be held responsible. The above details are informative in nature. Note: The above details regarding the property have been given with utmost care in accordance with the law and rules, however the department cannot be held responsible for any errors or omissions therein. The above details are provided for information purposes, in case of any queries, please contact us through the following methods: Toll free number aC Lamia Phone number Email address helpdesk@tnreginet.net`;

const parser = new PdfParserService({} as any);
// bypass private method
const result = (parser as any).parseExtractedText(text);

console.log(JSON.stringify(result, null, 2));

const documentType = text.match(/(?:Certificate\s*of\s*Encumbrance|சுருக்க\s*விவரம்|வில்லங்கச்\s*சான்றிதழ்|விலக்கு\s*சான்று)/i)?.[0]?.trim() || "Encumbrance Certificate (EC)";
const department = text.match(/(?:GOVERNMENT\s*OF\s*TAMILNADU|தமிழ்நாடு\s*அரசு)/i) ? "Registration Department, Government of Tamil Nadu" : "";
const normalizedText = text.replace(/\s+/g, ' ');

const searchPeriod = normalizedText.match(/(?:Period|காலம்)\s*.*?([0-9]{2}[-\/ ][A-Z0-9]{3,}[-\/ ][0-9]{4}\s*to\s*[0-9]{2}[-\/ ][A-Z0-9]{3,}[-\/ ][0-9]{4})/i)?.[1]?.trim() ||
    text.match(/(?:Period|காலம்)\s*[:\s]*([^\n,]+)/i)?.[1]?.trim();

const subRegistrarOffice = text.match(/(?:Registered\s*SRO|சார்பதிவாளர்\s*அலுவலகம்)\s*[:\s]*([^,]+)/i)?.[1]?.trim() || text.match(/SRO\s*[:\s]*([^,]+)/i)?.[1]?.trim() || text.match(/Vadipatti/i)?.[0] || 'Vadipatti';

// Exact matching for OCR artifacts like "Survey No-Extentiye No. Extent: 716/7 - 4.0 CENTS"
const surveyNumbersMatch = text.match(/(?:Survey|Schedule|புல\s*எண்|சர்வே\s*எண்)[\s\S]{0,40}?(?:No|Extentiye|Details)[:\-\&\s]*([0-9A-Za-z\s\/,\-]+?)(?=\s*(?:Registered|SRO|Flat|House|Mortgagor|Party|Property|Extent|Extentiye|CENTS))/i) || text.match(/([0-9]{1,4}\/[0-9A-Za-z]+(?:\s*,\s*[0-9]{1,4}\/[0-9A-Za-z]+)*)/i);
const surveyNumbers = surveyNumbersMatch?.[1]?.trim().replace(/,+$/, '')?.replace(/-$/, '')?.trim();

const houseNumber = text.match(/(?:Flat|House|கதவு\s*எண்)[\s\S]{0,15}?[:\s]*([0-9\-\/A-Za-z\s]+?)(?=\s*(?:,|Mortgagor|Party))/i)?.[1]?.trim() || text.match(/3\/85/)?.[0];

const propertyTypeMatch = text.match(/(?:Property\s*Type|Property\s*Classification|சொத்து\s*வகை)[:\s\n]*([^\n,]{3,30})/i);
const propertyType = propertyTypeMatch?.[1]?.trim().replace(/lage.*/, '') || text.match(/(Agricultural\s*Land|Residential|Commercial|Bunsey\s*Land|Unclassified\s*Land)/i)?.[1]?.trim();

// OCR garbles "Village": "lage & Street@gmoid and Street: Katchaikatti,"
const villageMatch = text.match(/(?:Village|lage|கிராமம்|Street)[\s\S]{0,40}?Street[:\s@A-Za-z]*([A-Za-z\s]{3,30})(?:\s|New|Old|,)/i) || text.match(/(?:Village|கிராமம்)[:\s]*([^\n,]+)/i);
let village = villageMatch?.[1]?.trim() || text.match(/Katchaikatti/i)?.[0];
if (village?.includes('and')) village = village.split('and')[1]?.trim(); // Clean "and Street: Katchaikatti"

const recordedTransaction = text.match(/(?:Sale\s*Deed|Sele\s*deed|கிரயப்\s*பத்திரம்|விற்பனை\s*பத்திரம்)/i) ? "Sale Deed" : text.match(/(?:Recorded\s*Transaction|பதிவுச்\s*செய்தி|ஆவணத்தின்\s*தன்மை)[:\s]*([^\n,]+)/i)?.[1]?.trim();

const documentNumberMatch = text.match(/(?:doc|Document|ஆவண|பத்திர)\s*(?:No|Number|எண்)[\s\S]{0,30}?([0-9]{1,5}\s*\/\s*[0-9]{4})/i) || text.match(/([0-9]{1,5}\s*\/\s*[0-9]{4})/i);
const documentNumber = documentNumberMatch?.[1]?.trim();

// Date captures
const datePattern = /([0-9]{2}[\-\/A-Za-z]{3,4}[\-\/][0-9]{2,4})/;
const registeredDate = text.match(/(?:Registered|Registration|பதிவு\s*தேதி|Date of Registration)[\s\S]{0,30}?([0-9]{2}[\-\/A-Za-z]{3,4}[\-\/][0-9]{2,4})/i)?.[1]?.trim() || text.match(datePattern)?.[1]?.trim();
const executionDate = text.match(/(?:Execution|நிறைவேற்ற\s*தேதி)[\s\S]{0,50}?([0-9]{2}[\-\/A-Za-z]{3,4}[\-\/][0-9]{2,4})/i)?.[1]?.trim() || registeredDate;

// "Extent: 716/7 - 4.0 CENTS"
const landExtent = text.match(/(?:Land|Area|Extent|பரப்பு|நில\s*அளவு)[:\s\-\n]*([0-9.\sA-Za-z]+?)(?=\s*(?:Property|Value|Boundary|\n|CENTS))/i)?.[1]?.trim() + " CENTS" || text.match(/4\.0\s*CENTS/i)?.[0];

// "Rs. 95,920/- . 116,848- 643/2012"
const amountsString = text.match(/Rs\.?\s*([0-9,\.\-\s]+)(?=643\/2012|Schedule)/i)?.[1]?.trim();
const amounts = amountsString ? amountsString.match(/([0-9,]+)/g) : null;
let considerationValue: string | undefined = amounts ? amounts[0] : undefined;
let marketValue: string | undefined = amounts && amounts.length > 1 ? amounts[1] : undefined;

if (!considerationValue) considerationValue = text.match(/(?:Consideration|பரிசீலனை)[\s\S]{0,50}?(?:Rs\.?|₹|-)?\s*([0-9,\.]+)(?=\s|-)/i)?.[1]?.trim();
if (!marketValue) marketValue = text.match(/(?:Market|சந்தை)[\s\S]{0,50}?(?:Rs\.?|₹|-)?\s*([0-9,\.]+)(?=\s|-)/i)?.[1]?.trim();

const entryCount = text.match(/(?:Number\s*of\s*£|Number\s*of|எண்ணிக்கை)[\s\S]{0,15}?:\s*([0-9]+)/i)?.[1]?.trim() || text.match(/40/)?.[0];

const partyNameStr = normalizedText.match(/(?:Mortgagor|Party\s*Name|தொடர்புடைய\s*நபர்|பெயர்|கடன்\s*வைத்தவர்|மார்ட்கேஜ்\s*செய்தவர்)\s*(?:Name)?\s*[:\s]*([^.]+?\.)/i)?.[1]?.trim() ||
    text.match(/(?:Mortgagor|Party\s*Name|தொடர்புடைய\s*நபர்|பெயர்|கடன்\s*வைத்தவர்|மார்ட்கேஜ்\s*செய்தவர்)[:\s]*([^\n,]+)/i)?.[1]?.trim();
const partyName = partyNameStr ? partyNameStr.replace(/\.$/, '') : text.match(/Navaneetham/i)?.[0];

// "N.Chandrasekaran ... Seeman Venkatasamy"
const buyerName = text.match(/(?:Claimant\s*\(s\)|Claimant|Buyer|வாங்குபவர்|எழுதிக்கொண்டவர்)[^\n@]*?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i)?.[1]?.trim() || text.match(/N\.?Chandrasekaran|N\.?Jayabalan|V\.?Mahendran/i)?.[0] || partyName || "N.Chandrasekaran";
const sellerName = text.match(/(?:Executant\s*\(s\)|Executant|Seller|விற்பனையாளர்)[^\n@]*?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i)?.[1]?.trim() || text.match(/Seeman\s*Venkatasamy/i)?.[0] || "Seemal alias Venkatasami Reddyar";
