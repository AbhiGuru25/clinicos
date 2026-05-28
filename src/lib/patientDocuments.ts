import { supabase } from '@/lib/supabase';

export type PatientDocument = {
  id: string;
  patient_id: string;
  file_name: string;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
  created_at: string;
};

// ─── Fetch all documents for a patient ───
export async function getPatientDocuments(patientId: string): Promise<PatientDocument[]> {
  try {
    const { data, error } = await supabase
      .from('patient_documents')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data ?? []) as PatientDocument[];
  } catch (err) {
    console.error('[patientDocuments] fetch error:', err);
    return [];
  }
}

// ─── Upload a file to Storage + insert DB row ───
export async function uploadPatientDocument(
  patientId: string,
  file: File
): Promise<{ doc: PatientDocument | null; error: string | null }> {
  const filePath = `${patientId}/${Date.now()}_${file.name}`;

  try {
    // 1. Upload to the public medical_records bucket
    const { data: storageData, error: storageError } = await supabase.storage
      .from('medical_records')
      .upload(filePath, file);

    if (storageError) throw new Error(`Storage: ${storageError.message}`);

    // 2. Build the public URL
    const { data: urlData } = supabase.storage
      .from('medical_records')
      .getPublicUrl(storageData.path);

    const publicUrl = urlData.publicUrl;

    // 3. Insert into patient_documents table
    const { data, error: dbError } = await supabase
      .from('patient_documents')
      .insert([
        {
          patient_id: patientId,
          file_name: file.name,
          file_url: publicUrl,
          file_type: file.type || null,
          file_size: file.size || null,
        },
      ])
      .select('*')
      .single();

    if (dbError) {
      // Rollback: remove from storage
      await supabase.storage.from('medical_records').remove([storageData.path]);
      throw new Error(`Database: ${dbError.message}`);
    }

    return { doc: data as PatientDocument, error: null };
  } catch (err: any) {
    console.error('[patientDocuments] upload error:', err);
    return { doc: null, error: err.message || 'Upload failed' };
  }
}

// ─── Delete a document (storage file + DB row) ───
export async function deletePatientDocument(doc: PatientDocument): Promise<{ success: boolean; error: string | null }> {
  try {
    // Extract the storage path from the full public URL
    // URL format: https://<project>.supabase.co/storage/v1/object/public/medical_records/<path>
    const marker = '/medical_records/';
    const idx = doc.file_url.indexOf(marker);
    const storagePath = idx !== -1 ? doc.file_url.slice(idx + marker.length) : '';

    if (storagePath) {
      const { error: storageError } = await supabase.storage
        .from('medical_records')
        .remove([storagePath]);
      if (storageError) console.warn('[patientDocuments] storage delete warning:', storageError.message);
    }

    const { error: dbError } = await supabase
      .from('patient_documents')
      .delete()
      .eq('id', doc.id);

    if (dbError) throw new Error(`Database: ${dbError.message}`);

    return { success: true, error: null };
  } catch (err: any) {
    console.error('[patientDocuments] delete error:', err);
    return { success: false, error: err.message || 'Delete failed' };
  }
}
