import { db } from './src/database/drizzle';
import { transactions } from './src/database/schema';
import * as fs from 'fs';
import 'dotenv/config';

async function exportData() {
  try {
    const data = await db.select().from(transactions);
    const jsonPath = './exported_transactions.json';
    const csvPath = './exported_transactions.csv';

    // Export JSON
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
    console.log(`Successfully exported ${data.length} records to ${jsonPath}`);
    
    // Export CSV
    if (data.length > 0) {
        const columns = Object.keys(data[0]);
        const header = columns.join(',');
        const rows = data.map(row => 
            columns.map(col => {
                const val = (row as any)[col];
                if (val === null || val === undefined) return '';
                const str = String(val);
                return `"${str.replace(/"/g, '""')}"`;
            }).join(',')
        ).join('\n');
        fs.writeFileSync(csvPath, header + '\n' + rows);
        console.log(`Successfully exported ${data.length} records to ${csvPath}`);
    }
  } catch (err) {
    console.error('Export failed:', err);
  } finally {
    process.exit();
  }
}

exportData();
