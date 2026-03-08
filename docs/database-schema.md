# Database Schema

The system uses a single table `transactions` to store the processed records. We store both the extracted Tamil text and its English translation to support localized search and original document verification.

## Tables

### `transactions`
Primary table for storing parsed EC data.

```mermaid
erDiagram
    transactions {
        serial id PK "Auto-increment"
        text document_type "Inherited from header"
        text department "Registration Authority"
        text search_period "Date range string"
        text sub_registrar_office "SRO name"
        text survey_numbers "Extracted from Survey No field"
        text house_number "Extracted from House No field"
        text property_type "Translated English"
        text property_type_tamil "Original Source"
        text village "Translated English"
        text village_tamil "Original Source"
        text recorded_transaction "Translated English"
        text recorded_transaction_tamil "Original Source"
        text document_number "Registration reference"
        text registered_date "Extracted date string"
        text buyer_name "Claimant field"
        text seller_name "Executant field"
        text party_name "Primary party extracted"
        text party_name_tamil "Original Source"
        timestamp created_at "System default"
    }
```

## Implementation Notes
*   **ORM**: Managed via Drizzle ORM (`pgTable`).
*   **Migrations**: Handled via `drizzle-kit push` for immediate schema syncing.
*   **Indexing**: Current search relies on ILIKE queries across `buyer_name`, `seller_name`, and `survey_numbers`. Full-text search indices can be added to the text columns if the dataset grows significantly.
