import { NextRequest, NextResponse } from 'next/server';
import { getThreads } from '@/app/actions';

// Simple auth check - in production, use proper authentication
function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const adminToken = process.env.ADMIN_API_TOKEN;
  
  if (!adminToken) {
    console.warn('ADMIN_API_TOKEN not configured - API is unprotected');
    return true; // Allow access if no token configured (dev mode)
  }
  
  return authHeader === `Bearer ${adminToken}`;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const threads = await getThreads();
    return NextResponse.json({ threads });
  } catch (error) {
    console.error('Error fetching threads:', error);
    return NextResponse.json({ error: 'Failed to fetch threads' }, { status: 500 });
  }
}
