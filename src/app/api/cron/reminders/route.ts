import { NextResponse } from 'next/server';
import { processReminders } from '@/app/api/appointments/reminders/route';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    // If CRON_SECRET is configured, enforce authorization
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const target = (searchParams.get('target') as any) || 'both';

    console.log(`[Cron Reminders] Running automated WhatsApp reminders dispatch for: ${target}`);
    const result = await processReminders(target);

    return NextResponse.json({
      cronExecuted: true,
      timestamp: new Date().toISOString(),
      ...result
    });
  } catch (err: any) {
    console.error('[Cron Reminders Error]:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
