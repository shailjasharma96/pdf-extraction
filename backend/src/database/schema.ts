import {
  pgTable,
  serial,
  text,
  integer,
  date,
  timestamp,
} from "drizzle-orm/pg-core";

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  documentType: text("document_type"),
  department: text("department"),
  searchPeriod: text("search_period"),
  subRegistrarOffice: text("sub_registrar_office"),
  surveyNumbers: text("survey_numbers"),
  houseNumber: text("house_number"),
  propertyType: text("property_type"),
  village: text("village"),
  recordedTransaction: text("recorded_transaction"),
  documentNumber: text("document_number"),
  registeredDate: text("registered_date"),
  buyerName: text("buyer_name"),
  sellerName: text("seller_name"),
  partyName: text("party_name"),
  createdAt: timestamp("created_at").defaultNow(),
});