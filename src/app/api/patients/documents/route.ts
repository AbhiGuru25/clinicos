import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cqxvcdrverdwhxccyluz.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxeHZjZHJ2ZXJkd2h4Y2N5bHV6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzU2Nzg0MywiZXhwIjoyMDkzMTQzODQzfQ.J4YGOOEPLY7reYhS5OLlY7K-Vv8v_w1lrGNhFp0tMUk';

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get('patient_id');

    if (!patientId) {
      return NextResponse.json({ success: false, error: 'Patient ID is required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('patient_documents')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('API Documents Fetch Error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, documents: data || [] });
  } catch (err: any) {
    console.error('API Documents GET Internal Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const patientId = formData.get('patient_id') as string;
    const file = formData.get('file') as File;

    if (!patientId || !file) {
      return NextResponse.json({ success: false, error: 'Patient ID and File are required' }, { status: 400 });
    }

    const fileBuffer = await file.arrayBuffer();
    const filePath = `${patientId}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;

    // 1. Ensure storage bucket exists
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    const bucketExists = buckets?.some(b => b.name === 'medical_records');
    if (!bucketExists) {
      await supabaseAdmin.storage.createBucket('medical_records', { public: true });
    }

    // 2. Upload to public storage
    const { data: storageData, error: storageError } = await supabaseAdmin.storage
      .from('medical_records')
      .upload(filePath, fileBuffer, {
        contentType: file.type || 'application/octet-stream',
        upsert: true
      });

    if (storageError) {
      return NextResponse.json({ success: false, error: `Storage Upload Failed: ${storageError.message}` }, { status: 400 });
    }

    // 3. Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('medical_records')
      .getPublicUrl(storageData.path);

    const publicUrl = urlData.publicUrl;

    // 4. Insert into patient_documents DB
    const { data: docRecord, error: dbError } = await supabaseAdmin
      .from('patient_documents')
      .insert([
        {
          patient_id: patientId,
          file_name: file.name,
          file_url: publicUrl,
          file_type: file.type || null,
          file_size: file.size || null,
        }
      ])
      .select('*')
      .single();

    if (dbError) {
      await supabaseAdmin.storage.from('medical_records').remove([storageData.path]);
      return NextResponse.json({ success: false, error: `Database Save Failed: ${dbError.message}` }, { status: 400 });
    }

    return NextResponse.json({ success: true, document: docRecord });
  } catch (err: any) {
    console.error('API Documents POST Internal Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const docId = searchParams.get('id');

    if (!docId) {
      return NextResponse.json({ success: false, error: 'Document ID is required' }, { status: 400 });
    }

    // 1. Fetch doc to get URL
    const { data: doc } = await supabaseAdmin
      .from('patient_documents')
      .select('*')
      .eq('id', docId)
      .single();

    if (doc?.file_url) {
      const marker = '/medical_records/';
      const idx = doc.file_url.indexOf(marker);
      const storagePath = idx !== -1 ? doc.file_url.slice(idx + marker.length) : '';
      if (storagePath) {
        await supabaseAdmin.storage.from('medical_records').remove([storagePath]);
      }
    }

    // 2. Delete DB row
    const { error } = await supabaseAdmin
      .from('patient_documents')
      .delete()
      .eq('id', docId);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
