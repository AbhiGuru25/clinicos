import { createClient } from '@supabase/supabase-js';

/**
 * Normalizes any phone number format (e.g., '+91 6352449698', '916352449698', '06352449698', '6352449698')
 * to a clean 10-digit standard Indian phone string: '6352449698'.
 */
export function normalizePhone(rawPhone: string): string {
  if (!rawPhone) return '';
  let cleaned = rawPhone.replace(/[^0-9]/g, '');

  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    cleaned = cleaned.slice(2);
  } else if (cleaned.length === 11 && cleaned.startsWith('0')) {
    cleaned = cleaned.slice(1);
  }

  return cleaned;
}

/**
 * Smart Patient Finder / Creator to eliminate duplicate patient records.
 * Searches for any variation of phone number (with or without 91/+91).
 */
export async function findOrCreatePatient(
  supabaseAdmin: any,
  {
    phone,
    name,
    clinicId,
    history
  }: {
    phone: string;
    name?: string;
    clinicId?: string | null;
    history?: string;
  }
) {
  const cleanPhone = normalizePhone(phone);
  if (!cleanPhone) throw new Error('Valid phone number is required');

  // Search by exact clean 10-digit, 12-digit, or +91 format
  const { data: existingPatients } = await supabaseAdmin
    .from('patients')
    .select('*')
    .or(`phone.eq.${cleanPhone},phone.eq.91${cleanPhone},phone.eq.+91${cleanPhone}`)
    .limit(5);

  let targetPatient = existingPatients?.[0];

  if (targetPatient) {
    // Update existing patient if cleanPhone or new name provided
    const updatePayload: any = {};
    if (targetPatient.phone !== cleanPhone) {
      updatePayload.phone = cleanPhone;
    }
    if (name && name !== 'New WhatsApp Patient' && name !== 'WhatsApp Patient' && targetPatient.name !== name) {
      updatePayload.name = name;
    }
    if (clinicId && !targetPatient.clinic_id) {
      updatePayload.clinic_id = clinicId;
    }

    if (Object.keys(updatePayload).length > 0) {
      const { data: updated } = await supabaseAdmin
        .from('patients')
        .update(updatePayload)
        .eq('id', targetPatient.id)
        .select()
        .single();
      if (updated) targetPatient = updated;
    }

    return targetPatient;
  }

  // Create new patient with clean phone number
  const patPayload: any = {
    name: name || 'Walk-In Patient',
    phone: cleanPhone,
    history: history || ''
  };
  if (clinicId) patPayload.clinic_id = clinicId;

  const { data: newPatient, error: createError } = await supabaseAdmin
    .from('patients')
    .insert([patPayload])
    .select()
    .single();

  if (createError) {
    throw new Error(`Patient creation failed: ${createError.message}`);
  }

  return newPatient;
}
