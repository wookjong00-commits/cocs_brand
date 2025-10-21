import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

const DATA_FILE = path.join(process.cwd(), 'data', 'site.json');

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
}

interface SiteData {
  heroImage: string;
  products: Product[];
}

async function getSiteData(): Promise<SiteData> {
  const dataDir = path.join(process.cwd(), 'data');

  if (!existsSync(dataDir)) {
    await mkdir(dataDir, { recursive: true });
  }

  if (!existsSync(DATA_FILE)) {
    const initialData: SiteData = {
      heroImage: '',
      products: [],
    };
    await writeFile(DATA_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }

  const data = await readFile(DATA_FILE, 'utf-8');
  return JSON.parse(data);
}

async function saveSiteData(data: SiteData) {
  await writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET - 제품 목록 조회
export async function GET(request: NextRequest) {
  try {
    const data = await getSiteData();
    return NextResponse.json({
      success: true,
      heroImage: data.heroImage,
      products: data.products,
    });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { success: false, message: '데이터를 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// POST - 제품 추가
export async function POST(request: NextRequest) {
  try {
    const { name, price, image } = await request.json();

    if (!name || !price || !image) {
      return NextResponse.json(
        { success: false, message: '모든 필드를 입력해주세요.' },
        { status: 400 }
      );
    }

    const data = await getSiteData();
    const newProduct: Product = {
      id: Date.now().toString(),
      name,
      price,
      image,
    };

    data.products.push(newProduct);
    await saveSiteData(data);

    return NextResponse.json({
      success: true,
      product: newProduct,
      message: '제품이 추가되었습니다.',
    });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { success: false, message: '제품 추가 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE - 제품 삭제
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: '제품 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const data = await getSiteData();
    data.products = data.products.filter((product) => product.id !== id);
    await saveSiteData(data);

    return NextResponse.json({
      success: true,
      message: '제품이 삭제되었습니다.',
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { success: false, message: '제품 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
