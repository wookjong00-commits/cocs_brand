import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;
    const type = formData.get('type') as string; // 'hero' or 'product'

    if (!image) {
      return NextResponse.json(
        { success: false, message: '이미지가 선택되지 않았습니다.' },
        { status: 400 }
      );
    }

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 파일명 생성 (타임스탬프 + 원본파일명)
    const timestamp = Date.now();
    const originalName = image.name.replace(/\s/g, '_');
    const filename = `${timestamp}_${originalName}`;

    // 업로드 디렉토리 생성
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', type);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // 파일 저장
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // URL 반환
    const url = `/uploads/${type}/${filename}`;

    // hero 이미지인 경우 데이터 파일 업데이트
    if (type === 'hero') {
      const dataPath = path.join(process.cwd(), 'data', 'site.json');
      const dataDir = path.join(process.cwd(), 'data');

      if (!existsSync(dataDir)) {
        await mkdir(dataDir, { recursive: true });
      }

      let siteData = { heroImage: '', products: [] };
      if (existsSync(dataPath)) {
        const fs = require('fs');
        const data = fs.readFileSync(dataPath, 'utf-8');
        siteData = JSON.parse(data);
      }

      siteData.heroImage = url;
      await writeFile(dataPath, JSON.stringify(siteData, null, 2));
    }

    return NextResponse.json({
      success: true,
      url,
      message: '이미지가 업로드되었습니다.',
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, message: '이미지 업로드 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
