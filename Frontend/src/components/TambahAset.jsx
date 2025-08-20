import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, Grid, TextField, Select, MenuItem, InputLabel, FormControl, useTheme } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useNavigate } from 'react-router-dom';

const TambahAset = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const navigate = useNavigate();

  const [namaBarang, setNamaBarang] = useState('');
  const [kategori, setKategori] = useState('');
  const [subKategori, setSubKategori] = useState('');
  const [noSeri, setNoSeri] = useState('');
  const [tanggalMasuk, setTanggalMasuk] = useState('');
  const [tanggalKeluar, setTanggalKeluar] = useState('');
  const [lokasi, setLokasi] = useState('Gudang');
  const [kondisiBarang, setKondisiBarang] = useState('');
  const [dokumentasi, setDokumentasi] = useState(null);
  const [kategoriList, setKategoriList] = useState([]);  
  const [subKategoriList, setSubKategoriList] = useState([]);  
  const [filteredSubKategoriList, setFilteredSubKategoriList] = useState([]);  
  const [kondisiList, setKondisiList] = useState([]);  

  const fileInputRef = useRef(null);
  const namaBarangRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const kategoriResponse = await fetch('http://localhost:4000/kategori');
        const kategoriData = await kategoriResponse.json();
        setKategoriList(kategoriData);

        const subKategoriResponse = await fetch('http://localhost:4000/subkategori');
        const subKategoriData = await subKategoriResponse.json();
        setSubKategoriList(subKategoriData);

        const kondisiResponse = await fetch('http://localhost:4000/kondisi');
        const kondisiData = await kondisiResponse.json();
        setKondisiList(kondisiData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (kategori) {
      const filteredSubKategori = subKategoriList.filter(sub => sub.kategoriId === parseInt(kategori));
      setFilteredSubKategoriList(filteredSubKategori);
    } else {
      setFilteredSubKategoriList([]);
    }
  }, [kategori, subKategoriList]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!namaBarang || !kategori || !subKategori || !noSeri || !tanggalMasuk || !tanggalKeluar || !lokasi || !kondisiBarang || !kondisiBarang) {
      alert('Data gagal ditambahkan. Semua field harus diisi!');
      return;
    }

    if (!dokumentasi) {
      alert('Please fill out the documentation field.');
      return;
    }
    
    if (new Date(tanggalKeluar) < new Date(tanggalMasuk)) {
      alert('Tanggal Keluar tidak bisa lebih awal dari Tanggal Masuk');
      return;
    }
  
    const createdAt = new Date().toISOString();
  
    const formData = new FormData();
    formData.append('namabarang', namaBarang);
    formData.append('kategori', kategori);
    formData.append('subkategori', subKategori);
    formData.append('noseri', noSeri);
    formData.append('tanggalmasuk', tanggalMasuk);
    formData.append('tanggalkeluar', tanggalKeluar);
    formData.append('lokasi', lokasi);
    formData.append('kondisibarang', kondisiBarang);
    formData.append('createdAt', createdAt);

    if (dokumentasi) {
      formData.append('dokumentasi', dokumentasi);
    }
  
    try {
      const response = await fetch('http://localhost:4000/aset', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        alert('Data berhasil ditambahkan!');
        resetForm();
      } else {
        alert('Data gagal ditambahkan');
      }
    } catch (error) {
      console.error('Terjadi error saat mencoba menambahkan data:', error);
      alert('Error: Tidak bisa mengirim data.');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDokumentasi(file);
    }
  };

  const handleKeyPressFileInput = (e) => {
    if (e.key === 'Enter') {
      fileInputRef.current.click();
    }
  };

  const resetForm = () => {
    setNamaBarang('');
    setKategori('');
    setSubKategori('');
    setNoSeri('');
    setTanggalMasuk('');
    setTanggalKeluar('');
    setLokasi('Gudang');
    setKondisiBarang('');
    setDokumentasi(null);
    namaBarangRef.current.focus(); // Set focus back to "Nama Barang"
    navigate('/aset');
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor={isDarkMode ? "#0A1929" : "#f4f6f9"}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          padding: '40px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          width: '600px'
        }}
      >
        <Box mb={3} textAlign="center">
          <h1 style={{ color: theme.palette.text.primary }}>Tambahkan Data Aset</h1>
        </Box>

        <Grid container spacing={3}>
          <Grid container item xs={12} sm={6} direction="column" spacing={3}>
            <Grid item>
              <TextField
                label="Nama Barang"
                fullWidth
                required
                value={namaBarang}
                onChange={(e) => setNamaBarang(e.target.value)}
                inputRef={namaBarangRef} // Set reference to "Nama Barang"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: isDarkMode ? 'white' : 'black',
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? 'white' : 'black',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: isDarkMode ? 'white' : 'black',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: isDarkMode ? 'white' : 'black',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: isDarkMode ? 'white' : 'black',
                  },
                }}
              />
            </Grid>
            <Grid item>
              <FormControl fullWidth>
                <InputLabel 
                  id="kategori-label"
                  sx={{
                    color: isDarkMode ? 'white' : 'black',
                  }}
                >
                  Pilih Kategori
                </InputLabel>
                <Select
                  labelId="kategori-label"
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: isDarkMode ? 'white' : 'black',
                      },
                      '&:hover fieldset': {
                        borderColor: isDarkMode ? 'white' : 'black',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: isDarkMode ? 'white' : 'black',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: isDarkMode ? 'white' : 'black',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: isDarkMode ? 'white' : 'black',
                    },
                  }}
                >
                  {kategoriList.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.namakategori}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl fullWidth>
                <InputLabel 
                  id="subkategori-label"
                  sx={{
                    color: isDarkMode ? 'white' : 'black',
                  }}
                >
                  Pilih Subkategori
                </InputLabel>
                <Select
                  labelId="subkategori-label"
                  value={subKategori}
                  onChange={(e) => setSubKategori(e.target.value)}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: isDarkMode ? 'white' : 'black',
                      },
                      '&:hover fieldset': {
                        borderColor: isDarkMode ? 'white' : 'black',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: isDarkMode ? 'white' : 'black',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: isDarkMode ? 'white' : 'black',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: isDarkMode ? 'white' : 'black',
                    },
                  }}
                >
                  {filteredSubKategoriList.length > 0 ? (
                    filteredSubKategoriList.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.namasubkategori}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="" disabled>
                      Tidak ada subkategori
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <TextField
                label="No. Seri"
                fullWidth
                required
                value={noSeri}
                onChange={(e) => setNoSeri(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: isDarkMode ? 'white' : 'black',
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? 'white' : 'black',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: isDarkMode ? 'white' : 'black',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: isDarkMode ? 'white' : 'black',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: isDarkMode ? 'white' : 'black',
                  },
                }}
              />
            </Grid>
            <Grid item>
            <TextField
  label="Tanggal Masuk"
  fullWidth
  required
  type="date"
  value={tanggalMasuk}
  onChange={(e) => setTanggalMasuk(e.target.value)}
  InputLabelProps={{ shrink: true }}
  sx={{
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: isDarkMode ? 'white' : 'black',
      },
      '&:hover fieldset': {
        borderColor: isDarkMode ? 'white' : 'black',
      },
      '&.Mui-focused fieldset': {
        borderColor: isDarkMode ? 'white' : 'black',
      },
      '& input': {
        color: isDarkMode ? 'white' : 'black',
        backgroundColor: 'transparent', // Menghilangkan warna latar belakang
      },
    },
    '& .MuiInputLabel-root': {
      color: isDarkMode ? 'white' : 'black',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: isDarkMode ? 'white' : 'black',
    },
  }}
/>

            </Grid>
          </Grid>

          <Grid container item xs={12} sm={6} direction="column" spacing={3}>
            <Grid item>
              <TextField
                label="Tanggal Keluar"
                fullWidth
                required
                type="date"
                value={tanggalKeluar}
                onChange={(e) => setTanggalKeluar(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: isDarkMode ? 'white' : 'black',
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? 'white' : 'black',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: isDarkMode ? 'white' : 'black',
                    },
                    '& input': {
                      color: isDarkMode ? 'white' : 'black',
                      backgroundColor: 'transparent', // Menghilangkan warna latar belakang
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: isDarkMode ? 'white' : 'black',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: isDarkMode ? 'white' : 'black',
                  },
                }}
              />
            </Grid>
            <Grid item>
              <TextField
                label="Lokasi"
                fullWidth
                required
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: isDarkMode ? 'white' : 'black',
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? 'white' : 'black',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: isDarkMode ? 'white' : 'black',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: isDarkMode ? 'white' : 'black',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: isDarkMode ? 'white' : 'black',
                  },
                }}
              />
            </Grid>
            <Grid item>
              <FormControl fullWidth>
                <InputLabel 
                  id="kondisi-label"
                  sx={{
                    color: isDarkMode ? 'white' : 'black',
                  }}
                >
                  Pilih Kondisi
                </InputLabel>
                <Select
                  labelId="kondisi-label"
                  value={kondisiBarang}
                  onChange={(e) => setKondisiBarang(e.target.value)}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: isDarkMode ? 'white' : 'black',
                      },
                      '&:hover fieldset': {
                        borderColor: isDarkMode ? 'white' : 'black',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: isDarkMode ? 'white' : 'black',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: isDarkMode ? 'white' : 'black',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: isDarkMode ? 'white' : 'black',
                    },
                  }}
                >
                  {kondisiList.map((item) => (
                    <MenuItem key={item.id} value={item.kondisibarang}>
                      {item.kondisibarang}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <Box 
                display="flex" 
                alignItems="center"
              >
                <InputLabel style={{ marginRight: '10px' }}>
                  Dokumentasi
                </InputLabel>
                <Button
                  variant="outlined"
                  component="label"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    textTransform: 'none',
                    borderColor: isDarkMode ? 'white' : 'black',
                    color: isDarkMode ? 'white' : 'black',
                    maxWidth: '150px',
                  }}
                  onKeyPress={handleKeyPressFileInput}
                >
                  <AttachFileIcon sx={{ marginRight: '5px' }} />
                    <Box
                      sx={{
                        flexGrow: 1,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {dokumentasi ? dokumentasi.name : 'Pilih File'}
                    </Box>
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                </Button>
              </Box>
            </Grid>
            <Grid item>
              <Box
                display="flex"
                justifyContent="space-between"
              >
                <Button
                  variant="contained"
                  sx={{
                    width: "130px",
                    fontSize: "18px",
                    padding: "4px 18px",
                    fontWeight:"bold",
                    backgroundColor: theme.palette.mode === 'dark' ? '#ca0128' : '#ff0000',
                    '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' ? '#ff0000' : '#ca0128',
                    },
                    color: '#ffffff',
                  }}
                  onClick={() => window.history.back()}
                >
                  <ArrowBackIcon sx={{ marginRight: '5px' }} />
                  Kembali
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    width: "110px",
                    fontSize: "18px",
                    padding: "4px 18px",
                    fontWeight:"bold",
                    backgroundColor: theme.palette.mode === 'dark' ? '#005a5b' : '#009698',
                    color: 'ffffff',
                    "&:hover": {
                      backgroundColor: theme.palette.mode === 'dark' ? '#009698' : '#005a5b',
                    },
                  }}
                  type="submit"
                >
                  <CheckIcon sx={{ marginRight: '5px' }} />
                  Kirim
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default TambahAset;
