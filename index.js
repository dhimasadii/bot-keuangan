const { create, Client } = require('@open-wa/wa-automate');

async function start(client) {
  // Ini fungsi utama botmu
  console.log('Bot sudah siap!');
  
  // Setelah bot siap, simpan sesi ke console (biar bisa copy paste ke Railway)
  const sessionData = await client.getSessionData();
  console.log("=== SESSION DATA ===");
  console.log(JSON.stringify(sessionData));
  console.log("====================");

  // Contoh handler pesan sederhana
  client.onMessage(async message => {
    if(message.body.toLowerCase().startsWith('ping')) {
      await client.sendText(message.from, 'Pong!');
    }
    // Tambah kode catat uangmu di sini ya
  });
}

create({
  sessionId: "bot-keuangan",
  multiDevice: true,
  headless: true,
  qrTimeout: 0,
  authTimeout: 60,
  cacheEnabled: true,
  useChrome: false,
  sessionData: process.env.WA_SESSION_DATA ? JSON.parse(process.env.WA_SESSION_DATA) : undefined,
}).then(client => start(client));

