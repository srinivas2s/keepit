import { NextRequest, NextResponse } from 'next/server';

// OCR is now handled client-side using Tesseract.js browser APIs.
// This route validates the file format only.
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('receipt') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Please upload a JPG, PNG, WEBP or PDF.' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024)  {
      return NextResponse.json({ error: 'File too large. Maximum size is 10MB.' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'File validated' });
  } catch (error) {
    console.error('File validation error:', error);
    return NextResponse.json({ error: 'Validation failed' }, { status: 500 });
  }                        
}