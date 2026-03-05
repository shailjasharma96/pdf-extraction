import { pgTable, serial, text, varchar, decimal, date, timestamp } from 'drizzle-orm/pg-core';

export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  documentNumber: varchar('document_number', { length: 255 }).notNull(),
  documentYear: varchar('document_year', { length: 4 }).notNull(),
  executionDate: date('execution_date').notNull(),
  nature: text('nature').notNull(), // e.g., "Sale deed"
  
  // Tamil originals
  executantsTamil: text('executants_tamil').notNull(), // Sellers
  claimantsTamil: text('claimants_tamil').notNull(),   // Buyers
  villageTamil: text('village_tamil').notNull(),
  
  // English translations
  executantsEnglish: text('executants_english'),
  claimantsEnglish: text('claimants_english'),
  villageEnglish: text('village_english'),
  
  considerationValue: decimal('consideration_value', { precision: 15, scale: 2 }),
  marketValue: decimal('market_value', { precision: 15, scale: 2 }),
  
  surveyNumber: varchar('survey_number', { length: 100 }).notNull(),
  propertyExtent: text('property_extent').notNull(), // e.g., "4.0 CENTS"
  
  ownerName: text('owner_name'), // Extracted from remarks if available
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
