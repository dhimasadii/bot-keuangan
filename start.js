const { create } = require('@open-wa/wa-automate');
const fs = require('fs');

const FILE_PATH = 'catatan-uang.json';

// Fungsi simpan data ke file JSON
function saveToLocal(tipe, nominal, keterangan, penginput) {
  const data = {
    tipe,
    nominal: parseInt(nominal),
    keterangan,
    penginput,
    waktu: new Date().toISOString()
  };

  let db = [];
  if (fs.existsSync(FILE_PATH)) {
    db = JSON.parse(fs.readFileSync(FILE_PATH));
  }
  db.push(data);
  fs.writeFileSync(FILE_PATH, JSON.stringify(db, null, 2));
}

async function start(client) {
  console.log('Bot sudah siap!');

  const sessionData = await client.getSessionData();
  console.log("=== SESSION DATA ===");
  console.log(JSON.stringify(sessionData));
  console.log("====================");

  client.onMessage(async message => {
    const msg = message.body.toLowerCase();

    if (msg.startsWith('masuk')) {
      const [_, nominal, ...keterangan] = msg.split(" ");
      saveToLocal('masuk', nominal, keterangan.join(" "), message.sender.pushname);
      await client.reply(message.from, `✅ Pemasukan Rp${nominal} dicatat: ${keterangan.join(" ")}`, message.id);
    }

    if (msg.startsWith('keluar')) {
      const [_, nominal, ...keterangan] = msg.split(" ");
      saveToLocal('keluar', nominal, keterangan.join(" "), message.sender.pushname);
      await client.reply(message.from, `✅ Pengeluaran Rp${nominal} dicatat: ${keterangan.join(" ")}`, message.id);
    }
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
