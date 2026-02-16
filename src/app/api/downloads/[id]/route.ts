import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Find and validate the download verification token
    const verification = await prisma.downloadVerification.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });

    if (!verification) {
      return NextResponse.json(
        { error: 'Invalid download link' },
        { status: 404 }
      );
    }

    // Check if token has expired
    if (new Date() > verification.expires) {
      // Delete expired token
      await prisma.downloadVerification.delete({
        where: { id },
      });

      return NextResponse.json(
        { error: 'Download link has expired' },
        { status: 410 }
      );
    }

    // Get the file path
    const filePath = verification.product.filePath;

    // Check if it's a public URL or local file
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      // Redirect to external URL
      return NextResponse.redirect(filePath);
    }

    // Handle local file download
    try {
      const fullPath = join(process.cwd(), 'public', filePath);
      const fileBuffer = await readFile(fullPath);

      // Delete the one-time use token
      await prisma.downloadVerification.delete({
        where: { id },
      });

      // Determine content type based on file extension
      const ext = filePath.split('.').pop()?.toLowerCase();
      const contentTypes: { [key: string]: string } = {
        pdf: 'application/pdf',
        zip: 'application/zip',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        txt: 'text/plain',
      };
      const contentType = contentTypes[ext || ''] || 'application/octet-stream';

      // Return file with appropriate headers
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${verification.product.name}.${ext}"`,
          'Content-Length': fileBuffer.length.toString(),
        },
      });
    } catch (error) {
      console.error('Error reading file:', error);
      return NextResponse.json(
        { error: 'File not found on server' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error processing download:', error);
    return NextResponse.json(
      { error: 'Failed to process download' },
      { status: 500 }
    );
  }
}
