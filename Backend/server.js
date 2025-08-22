require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');  // Untuk hashing nama file
const app = express();
const WebSocket = require('ws');
const http = require('http');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcrypt'); // Untuk enkripsi password
const saltRounds = 10;

const server = http.createServer(app);  // Membuat HTTP server untuk WebSocket dan Express
const wss = new WebSocket.Server({ server });  // Gabung WebSocket dengan server yang sama



// daftar origin yang kita izinkan: localhost + semua vercel.app
const allowedExact = new Set([
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5000'
]);

const isAllowedOrigin = (origin) => {
  if (!origin) return true; // untuk request server-to-server
  if (allowedExact.has(origin)) return true;
  // izinkan semua subdomain vercel.app
  if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin)) return true;
  return false;
};

app.use(cors({
  origin: (origin, cb) => {
    if (isAllowedOrigin(origin)) return cb(null, true);
    return cb(new Error('CORS blocked: ' + origin));
  },
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  credentials: true
}));

// Handle preflight
app.options('*', cors());



app.set('trust proxy', 1);  // Memberitahu Express bahwa server berjalan di balik proxy


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // Batas berbeda untuk production dan development
  message: 'Terlalu banyak permintaan dari IP ini, coba lagi nanti.'
});

app.use(limiter); // Terapkan rate limiting ke semua rute
// Static file configuration for production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
}


// WebSocket handling
wss.on('connection', (ws) => {
  console.log('Client terhubung');

  ws.on('message', (message) => {
    console.log(`Pesan diterima dari klien: ${message}`);
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client terputus');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);  // Tambahkan error handling di server
  });
});


// Set folder penyimpanan file menggunakan multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = './public/uploads';  // Simpan file di folder uploads dalam folder public
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);  // Simpan file di folder uploads
  },
  filename: function (req, file, cb) {
    // Menggunakan hashing untuk nama file yang unik
    const hash = crypto.createHash('sha256').update(file.originalname + Date.now()).digest('hex');
    cb(null, hash + path.extname(file.originalname));  // Nama file diubah menjadi hash
  }
});


// Filter untuk hanya memperbolehkan file tertentu
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|pdf/; // Hanya izinkan file gambar dan PDF
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('File tidak valid! Hanya file gambar dan PDF yang diperbolehkan.'));
};

// Inisialisasi multer dengan storage dan filter
const upload = multer({ 
  storage: storage, 
  fileFilter: fileFilter 
});


// Serve static files untuk gambar
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));  // Akses folder uploads

// Middleware untuk parsing JSON dan URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS setup
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Simulasi database sederhana menggunakan file JSON
const dbPath = './db.json';

// Fungsi untuk membaca data dari file JSON
const readData = () => {
  const data = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(data);
};

// Fungsi untuk menulis data ke file JSON
const writeData = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
};

//fungsi untuk membuat id secara urut
const generateNewId = (arr) => {
  if (arr.length === 0) return 1;
  const lastId = arr[arr.length - 1].id;
  return lastId + 1;
};

// --- KATEGORI CRUD ---

// Get semua kategori
app.get('/kategori', (req, res) => {
  try {
    const data = readData();
    res.json(data.kategori);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data kategori', error: error.message });
  }
});

// Get satu kategori berdasarkan ID
app.get('/kategori/:id', (req, res) => {
  try {
    const { id } = req.params;
    const data = readData();
    const kategori = data.kategori.find(kat => kat.id === parseInt(id));

    if (!kategori) {
      return res.status(404).json({ message: 'Kategori tidak ditemukan' });
    }

    res.json(kategori);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data kategori', error: error.message });
  }
});

// Create kategori
app.post('/kategori', (req, res) => {
  const { namakategori, createdAt } = req.body;
  const data = readData();
  const newId = generateNewId(data.kategori);

  const newKategori = {
    id: newId,
    namakategori,
    createdAt
  };

  data.kategori.push(newKategori);
  writeData(data);
  res.json({ message: 'Kategori berhasil ditambahkan', kategori: newKategori });
});

// Update kategori
app.put('/kategori/:id', (req, res) => {
  const { id } = req.params;
  const { namakategori } = req.body;
  const data = readData();
  const kategoriIndex = data.kategori.findIndex(kat => kat.id === parseInt(id));

  if (kategoriIndex === -1) {
    return res.status(404).json({ message: 'Kategori tidak ditemukan' });
  }

  data.kategori[kategoriIndex].namakategori = namakategori;
  writeData(data);
  res.json({ message: 'Kategori berhasil diperbarui', kategori: data.kategori[kategoriIndex] });
});

// Delete kategori
app.delete('/kategori/:id', (req, res) => {
  const { id } = req.params;
  const data = readData();
  const kategoriIndex = data.kategori.findIndex(kat => kat.id === parseInt(id));

  if (kategoriIndex === -1) {
    return res.status(404).json({ message: 'Kategori tidak ditemukan' });
  }

  const deletedKategori = data.kategori.splice(kategoriIndex, 1);
  writeData(data);
  res.json({ message: 'Kategori berhasil dihapus', kategori: deletedKategori[0] });
});

// --- SUBKATEGORI CRUD ---


// Create subkategori baru
app.post('/subkategori', (req, res) => {
  try {
    const { namasubkategori, kategoriId } = req.body; 
    if (!namasubkategori || !kategoriId) {
      return res.status(400).json({ message: 'Nama subkategori dan kategoriId harus diisi.' });
    }

    const data = readData(); 
    const newId = data.subkategori.length ? data.subkategori[data.subkategori.length - 1].id + 1 : 1;
    const newSubkategori = {
      id: newId,
      namasubkategori,
      kategoriId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    data.subkategori.push(newSubkategori);
    writeData(data); 

    res.status(201).json({ message: 'Subkategori berhasil ditambahkan', subkategori: newSubkategori });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menambahkan subkategori', error: error.message });
  }
});


// Get semua subkategori
app.get('/subkategori', (req, res) => {
  try {
    const data = readData();
    res.json(data.subkategori || []);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data subkategori', error: error.message });
  }
});

// Get satu subkategori berdasarkan ID
app.get('/subkategori/:id', (req, res) => {
  try {
    const { id } = req.params;
    const data = readData();
    const subkategori = data.subkategori.find(sub => sub.id === parseInt(id));

    if (!subkategori) {
      return res.status(404).json({ message: 'Subkategori tidak ditemukan' });
    }

    res.json(subkategori);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data subkategori', error: error.message });
  }
});



// Update subkategori
app.put('/subkategori/:id', (req, res) => {
  const { id } = req.params;
  const { namasubkategori, kategoriId } = req.body;
  const data = readData();
  const subkategoriIndex = data.subkategori.findIndex(sub => sub.id === parseInt(id));

  if (subkategoriIndex === -1) {
    return res.status(404).json({ message: 'Subkategori tidak ditemukan' });
  }

  data.subkategori[subkategoriIndex] = {
    ...data.subkategori[subkategoriIndex],
    namasubkategori,
    kategoriId
  };
  writeData(data);
  res.json({ message: 'Subkategori berhasil diperbarui', subkategori: data.subkategori[subkategoriIndex] });
});

// Delete subkategori
app.delete('/subkategori/:id', (req, res) => {
  const { id } = req.params;
  const data = readData();
  const subkategoriIndex = data.subkategori.findIndex(sub => sub.id === parseInt(id));

  if (subkategoriIndex === -1) {
    return res.status(404).json({ message: 'Subkategori tidak ditemukan' });
  }

  const deletedSubkategori = data.subkategori.splice(subkategoriIndex, 1);
  writeData(data);
  res.json({ message: 'Subkategori berhasil dihapus', subkategori: deletedSubkategori[0] });
});

// --- KONDISI CRUD ---

// Get semua kondisi
app.get('/kondisi', (req, res) => {
  try {
    const data = readData();
    res.json(data.kondisi);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data kondisi', error: error.message });
  }
});

// Create kondisi
app.post('/kondisi', (req, res) => {
  const { kondisibarang, createdAt } = req.body;
  const data = readData();
  const newId = generateNewId(data.kondisi);

  const newKondisi = {
    id: newId,
    kondisibarang,
    createdAt
  };

  data.kondisi.push(newKondisi);
  writeData(data);
  res.json({ message: 'Kondisi berhasil ditambahkan', kondisi: newKondisi });
});

// Update kondisi
app.put('/kondisi/:id', (req, res) => {
  const { id } = req.params;
  const { kondisibarang } = req.body;
  const data = readData();
  const kondisiIndex = data.kondisi.findIndex(kondisi => kondisi.id === parseInt(id));

  if (kondisiIndex === -1) {
    return res.status(404).json({ message: 'Kondisi tidak ditemukan' });
  }

  data.kondisi[kondisiIndex].kondisibarang = kondisibarang;
  writeData(data);
  res.json({ message: 'Kondisi berhasil diperbarui', kondisi: data.kondisi[kondisiIndex] });
});

// Delete kondisi
app.delete('/kondisi/:id', (req, res) => {
  const { id } = req.params;
  const data = readData();
  const kondisiIndex = data.kondisi.findIndex(kondisi => kondisi.id === parseInt(id));

  if (kondisiIndex === -1) {
    return res.status(404).json({ message: 'Kondisi tidak ditemukan' });
  }

  const deletedKondisi = data.kondisi.splice(kondisiIndex, 1);
  writeData(data);
  res.json({ message: 'Kondisi berhasil dihapus', kondisi: deletedKondisi[0] });
});



// GET semua request reset sandi
app.get('/requestsandi', (req, res) => {
  try {
    const data = readData();
    res.json(data.requestsandi); // Pastikan `requestsandi` ada dalam data JSON
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data request reset sandi', error: error.message });
  }
});



// Create reset sandi
app.post('/requestsandi', (req, res) => {
  try {
    const { requestresetsandi, createdAt } = req.body; 
    const data = readData();
    const newId = generateNewId(data.requestsandi || []);

    const newRequestSandi = {
      id: newId,
      requestresetsandi,
      createdAt
    };

    if (!data.requestsandi) {
      data.requestsandi = [];
    }
    
    data.requestsandi.push(newRequestSandi);
    writeData(data); 

    // Kirim update data ke semua client WebSocket
    const payload = JSON.stringify({ type: 'requestsandi_update', action: 'create', requestsandi: newRequestSandi });
    console.log('Mengirim pesan WebSocket (create):', payload); // Logging untuk debugging
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });

    res.status(201).json({ message: 'requestsandi berhasil ditambahkan', requestsandi: newRequestSandi });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menambahkan requestsandi', error: error.message });
  }
});


// Delete requestsandi
app.delete('/requestsandi/:id', (req, res) => {
  try {
    const { id } = req.params; 
    const data = readData();

    const requestsandiIndex = data.requestsandi.findIndex(requestsandi => requestsandi.id === parseInt(id));

    if (requestsandiIndex === -1) {
      return res.status(404).json({ message: 'requestsandi tidak ditemukan' });
    }

    const deletedrequestsandi = data.requestsandi.splice(requestsandiIndex, 1);
    writeData(data);

    // Kirim update data ke semua client WebSocket
    const payload = JSON.stringify({ type: 'requestsandi_update', action: 'delete', id });
    console.log('Mengirim pesan WebSocket (delete):', payload); // Logging untuk debugging
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });

    res.json({ message: 'requestsandi berhasil dihapus', requestsandi: deletedrequestsandi[0] });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus requestsandi', error: error.message });
  }
});



// CRUD untuk Aset

// Get semua aset dengan filter subkategori
app.get('/aset', (req, res) => {
  try {
    const data = readData();
    const { subkategoriId } = req.query;

    let aset = data.aset;

    // Filter aset berdasarkan subkategoriId jika subkategoriId diberikan
    if (subkategoriId) {
      aset = aset.filter(asetItem => asetItem.subkategori === subkategoriId);
    }

    res.json(aset);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data aset', error: error.message });
  }
});

app.get('/aset/:id', (req, res) => {
  const { id } = req.params;
  console.log(`Fetching aset with id: ${id}`);
  const data = readData();
  const aset = data.aset.find(item => item.id === parseInt(id));

  if (!aset) {
    console.log(`Aset with id: ${id} not found`);
    return res.status(404).json({ message: 'Aset tidak ditemukan' });
  }

  res.json(aset);
});


// Create aset
app.post('/aset', upload.single('dokumentasi'), (req, res) => {
  const { namabarang, kategori, subkategori, noseri, tanggalmasuk, tanggalkeluar, lokasi, kondisibarang, createdAt } = req.body;
  const data = readData();
  const newId = generateNewId(data.aset);

  const newAset = {
    id: newId,
    namabarang,
    kategori,
    subkategori,
    noseri,
    tanggalmasuk,
    tanggalkeluar,
    lokasi,
    kondisibarang,
    createdAt,
    dokumentasi: req.file ? `/uploads/${req.file.filename}` : null
  };

  data.aset.push(newAset);
  writeData(data);

  res.json({ message: 'Aset berhasil ditambahkan', aset: newAset });
});

// Route to handle file upload for berita acara
app.post('/aset/:id/beritaacara', upload.single('beritaacara'), (req, res) => {
  const { id } = req.params;
  const data = readData();
  const asetIndex = data.aset.findIndex(aset => aset.id === parseInt(id));

  if (asetIndex === -1) {
    return res.status(404).json({ message: 'Aset tidak ditemukan' });
  }

  console.log('File uploaded:', req.file);  // Cek apakah file ter-upload

  if (req.file) {
    data.aset[asetIndex].beritaacara = `/uploads/${req.file.filename}`;
  }

  writeData(data);
  res.json(data.aset[asetIndex]);
});



// Update aset
app.put('/aset/:id', upload.single('dokumentasi'), (req, res) => {
  const { id } = req.params;
  const { namabarang, kategori, subkategori, noseri, tanggalmasuk, tanggalkeluar, lokasi, kondisibarang } = req.body;

  const data = readData();
  const asetIndex = data.aset.findIndex(aset => aset.id === parseInt(id));

  if (asetIndex === -1) {
    return res.status(404).json({ message: 'Aset tidak ditemukan' });
  }

  const updatedAset = {
    ...data.aset[asetIndex],
    namabarang,
    kategori,
    subkategori,
    noseri,
    tanggalmasuk,
    tanggalkeluar,
    lokasi,
    kondisibarang,
    dokumentasi: req.file ? `/uploads/${req.file.filename}` : data.aset[asetIndex].dokumentasi
  };

  data.aset[asetIndex] = updatedAset;
  writeData(data);

  // Emit the updated aset data to all WebSocket clients
  const payload = JSON.stringify({ type: 'aset_update', aset: updatedAset });
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });

  res.json({ message: 'Aset berhasil diperbarui', aset: updatedAset });
});

// Delete aset
app.delete('/aset/:id', (req, res) => {
  const { id } = req.params;

  const data = readData();
  const asetIndex = data.aset.findIndex(aset => aset.id === parseInt(id));

  if (asetIndex === -1) {
    return res.status(404).json({ message: 'Aset tidak ditemukan' });
  }

  const deletedAset = data.aset.splice(asetIndex, 1);
  writeData(data);

  res.json({ message: 'Aset berhasil dihapus', aset: deletedAset[0] });
});

// CRUD untuk Users

// Get semua users
app.get('/users', (req, res) => {
  try {
    const data = readData();
    if (data && data.users) {
      res.json(data.users);
    } else {
      res.status(404).json({ message: 'Data users tidak ditemukan' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data users', error: error.message });
  }
});


// Endpoint untuk mengirimkan status user (online/offline)
app.get('/users/status', (req, res) => {
  const data = readData(); // Membaca data dari db.json

  if (!data.users || data.users.length === 0) {
    return res.status(404).json({ message: 'User tidak ditemukan' });
  }

  const adminOnline = data.users.filter(user => user.level === 'admin' && user.status === 'online').length;
  const adminOffline = data.users.filter(user => user.level === 'admin' && user.status === 'offline').length;
  const operatorOnline = data.users.filter(user => user.level === 'operator' && user.status === 'online').length;
  const operatorOffline = data.users.filter(user => user.level === 'operator' && user.status === 'offline').length;

  // Format data untuk bar chart
  const userStatusData = [
    { status: 'Admin Online', adminOnline: adminOnline, color: '#4CAF50' },
    { status: 'Admin Offline', adminOffline: adminOffline, color: '#F44336' },
    { status: 'Operator Online', operatorOnline: operatorOnline, color: '#2196F3' },
    { status: 'Operator Offline', operatorOffline: operatorOffline, color: '#FFC107' }
  ];

  res.json(userStatusData);
});




// Get user berdasarkan ID
app.get('/users/:id', (req, res) => {
  try {
    const { id } = req.params; // Mendapatkan ID dari parameter URL
    const data = readData();
    const user = data.users.find(user => user.id === parseInt(id)); // Pastikan ID-nya dibandingkan sebagai integer

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' }); // Kembalikan pesan kesalahan jika tidak ada user
    }

    res.json(user); // Mengirimkan data user sebagai respon
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data user', error: error.message });
  }
});

// Create user dengan bcrypt
app.post('/users', upload.single('foto'), async (req, res) => {
  const { name, password, level, status, lastseen, createdAt } = req.body;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const data = readData(); // Membaca data dari JSON setelah pengenkripsian password
  
  const newUser = {
    id: generateNewId(data.users),
    name,
    password: hashedPassword,
    level,
    status,
    lastseen,
    createdAt,
    foto: req.file ? `/uploads/${req.file.filename}` : null
  };

  data.users.push(newUser);
  writeData(data);
  res.json({ message: 'User berhasil ditambahkan', user: newUser });
});


// Update status user saat login
app.post('/users/login', async (req, res) => {
  const { name, password } = req.body;
  const data = readData();
  const user = data.users.find(u => u.name === name);

  if (user && await bcrypt.compare(password, user.password)) {
    user.status = "online";
    user.lastseen = new Date().toISOString();
    writeData(data);

    // Kirim respon ke frontend
    res.json({ success: true, message: 'Login berhasil', user });

    // Kirim status online ke semua client WebSocket
    const payload = JSON.stringify({ type: 'status', user });
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });

  } else {
    res.status(401).json({ success: false, message: 'Login gagal' });
  }
});


// Update user dengan bcrypt
app.put('/users/:id', upload.single('foto'), async (req, res) => {
  const { id } = req.params;
  const { name, password, level, status, lastseen } = req.body; // all user fields to be updated
  const data = readData();
  const userIndex = data.users.findIndex(user => user.id === parseInt(id));

  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Jika password diisi, enkripsi password baru
  let updatedPassword = data.users[userIndex].password;
  if (password) {
    updatedPassword = await bcrypt.hash(password, saltRounds);
  }

  // Update only the fields that are provided
  const updatedUser = {
    ...data.users[userIndex],
    name: name || data.users[userIndex].name,
    password: updatedPassword,
    level: level || data.users[userIndex].level,
    status: status || data.users[userIndex].status,
    lastseen: lastseen || data.users[userIndex].lastseen,
    foto: req.file ? `/uploads/${req.file.filename}` : data.users[userIndex].foto // Update photo if new file uploaded
  };

  // Save the updated data
  data.users[userIndex] = updatedUser;
  writeData(data);

  // Send response
  res.json({ message: 'User updated successfully', user: updatedUser });
});




// Delete user
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  const data = readData();
  const userIndex = data.users.findIndex(user => user.id === parseInt(id));

  if (userIndex === -1) {
    return res.status(404).json({ message: 'User tidak ditemukan' });
  }

  const deletedUser = data.users.splice(userIndex, 1);
  writeData(data);

  res.json({ message: 'User berhasil dihapus', user: deletedUser[0] });
});


// Endpoint logout user
app.post('/users/logout/:id', (req, res) => {
  const { id } = req.params;
  const data = readData();
  const user = data.users.find(user => user.id === parseInt(id));

  if (user) {
    user.status = "offline";
    user.lastseen = new Date().toISOString();

    try {
      writeData(data); // Pastikan menulis data tidak menyebabkan error
    } catch (error) {
      return res.status(500).json({ message: 'Failed to update user data' });
    }


    // Kirim status offline ke semua client WebSocket
    const payload = JSON.stringify({ type: 'status', user });
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });

    res.json({ message: 'Logout successful', user });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});


// Jalankan server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});



