import { NextRequest, NextResponse } from 'next/server';

// 간단한 인증 (실제 프로덕션에서는 bcrypt + JWT 사용 권장)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
};

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      // 간단한 토큰 생성 (실제로는 JWT 사용 권장)
      const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');

      return NextResponse.json({
        success: true,
        token,
        message: '로그인 성공'
      });
    } else {
      return NextResponse.json(
        { success: false, message: '아이디 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
