async function testVercel() {
  console.log('Testing Vercel live URL...');
  try {
    const res = await fetch('https://clinicos-vert.vercel.app/api/ai/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patient_name: 'Omnidim Test',
        phone: '9558855508',
        date: '2026-08-31',
        time: '11:00 AM'
      })
    });
    console.log('Status Code:', res.status);
    const text = await res.text();
    console.log('Response text:', text);
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
}

testVercel();
