import { NextRequest, NextResponse } from 'next/server';
import Tesseract from 'tesseract.js';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('receipt') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Convert file to Buffer for Tesseract
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Use Tesseract.js for Open Source OCR
    // We use a worker for better control, though recognize is simpler
    const { data: { text } } = await Tesseract.recognize(
      buffer,
      'eng',
      { 
        logger: m => console.log(m) // Optional: log progress
      }
    );

    if (!text) {
      return NextResponse.json({ error: 'Failed to extract text from image' }, { status: 500 });
    }

    // Parse OCR text using our robust parser
    const extractedData = parseReceiptText(text);

    return NextResponse.json({
      success: true,
      engine: 'Tesseract (Open Source)',
      data: extractedData,
      rawText: text,
    });
  } catch (error) {
    console.error('OCR Error:', error);
    return NextResponse.json({ error: 'OCR processing failed' }, { status: 500 });
  }
}

function parseReceiptText(text: string) {
  // Enhanced parsing logic for Tesseract output
  const lines = text.split('\n').filter(l => l.trim().length > 0);
  
  let name = '';
  let brand = 'Other';
  let retailer = 'Unknown';
  let amount = 0;
  let date = new Date().toISOString().split('T')[0];

  // Common brands and retailers to look for
  const brandList = ['Apple', 'Samsung', 'Sony', 'LG', 'Dyson', 'HP', 'Dell', 'Logitech', 'Bose'];
  const retailerList = ['Amazon', 'Flipkart', 'Croma', 'Reliance', 'Apple Store', 'Walmart', 'Best Buy'];

  for (const line of lines) {
    const lower = line.toLowerCase();

    // Amount extraction: looking for currency patterns
    const amountMatch = line.match(/(?:₹|Rs\.?|INR|\$)\s*([\d,]+\.?\d*)/i);
    if (amountMatch) {
      const parsed = parseFloat(amountMatch[1].replace(/,/g, ''));
      if (!isNaN(parsed) && parsed > amount) amount = parsed;
    }

    // Date extraction: DD/MM/YYYY or MM/DD/YYYY
    const dateMatch = line.match(/(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})/);
    if (dateMatch) {
      const [, d, m, y] = dateMatch;
      const year = y.length === 2 ? `20${y}` : y;
      // Try to determine if it's DD/MM or MM/DD
      if (parseInt(d) > 12) date = `${year}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
      else date = `${year}-${d.padStart(2, '0')}-${m.padStart(2, '0')}`;
    }

    // Identify Brand
    brandList.forEach(b => {
      if (lower.includes(b.toLowerCase())) brand = b;
    });

    // Identify Retailer
    retailerList.forEach(r => {
      if (lower.includes(r.toLowerCase())) retailer = r;
    });
  }

  // Use the most prominent line as product name if not determined
  name = lines.find(l => l.length > 5 && l.length < 50 && !l.includes('Total') && !l.includes('Tax')) || 'New Product';

  return {
    name: name.trim(),
    brand,
    retailer,
    purchase_date: date,
    warranty_months: 12, // Default
    amount_paid: amount,
  };
}
