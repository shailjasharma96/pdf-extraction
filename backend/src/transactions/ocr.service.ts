import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import { createWorker } from 'tesseract.js';
import { fromBuffer } from 'pdf2pic';

@Injectable()
export class OcrService {
    /**
     * Run the full OCR pipeline on an image-based PDF buffer.
     */
    async runOcrPipeline(buffer: Buffer): Promise<string> {
        console.log('[OCR] Starting OCR pipeline...');

        // 1. Convert PDF to Image(s)
        const options = {
            density: 300, // 300 DPI
            saveFilename: 'page',
            savePath: '/tmp', // Temporary directory
            format: 'png',
            width: 2480,
            height: 3508
        };

        const storeAsImage = fromBuffer(buffer, options);
        let images: any;
        try {
            // Bulk conversion (convert all pages)
            images = await storeAsImage.bulk(-1, { responseType: 'buffer' });
        } catch (err) {
            console.error('[OCR] Error converting PDF to images:', err);
            throw new Error('Failed to convert PDF to image for OCR.');
        }

        if (!images || images.length === 0) {
            throw new Error('[OCR] No pages found to process.');
        }

        let extractedText = '';

        // Initialize Tesseract worker
        const worker = await createWorker('tam+eng');

        for (const image of images) {
            if (!image.buffer) continue;

            // 2. Preprocess Image
            const processedBuffer = await this.preprocessImage(image.buffer);

            // 3. OCR Processing
            try {
                const { data: { text } } = await worker.recognize(processedBuffer);
                extractedText += text + '\n\n';
            } catch (err) {
                console.error(`[OCR] Error recognizing text on page ${image.page}:`, err);
            }
        }

        await worker.terminate();
        console.log('[OCR] OCR Pipeline completed.');
        return extractedText;
    }

    /**
     * Preprocess images using Sharp to improve Tesseract accuracy
     */
    private async preprocessImage(buffer: Buffer): Promise<Buffer> {
        return sharp(buffer)
            .grayscale() // Convert to grayscale
            .normalize() // Normalize image
            //.threshold(200) // Optional: basic thresholding
            .toBuffer();
    }
}
