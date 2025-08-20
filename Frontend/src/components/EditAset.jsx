import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, Grid, TextField, Select, MenuItem, InputLabel, FormControl, useTheme } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useNavigate, useParams } from 'react-router-dom';

const EditAset = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const navigate = useNavigate();
  const { id } = useParams();

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const kategoriResponse = await fetch('${process.env.REACT_APP_API_URL}/kategori');
        const kategoriData = await kategoriResponse.json();
        setKategoriList(kategoriData);

        const subKategoriResponse = await fetch('${process.env.REACT_APP_API_URL}/subkategori');
        const subKategoriData = await subKategoriResponse.json();
        setSubKategoriList(subKategoriData);

        const kondisiResponse = await fetch('${process.env.REACT_APP_API_URL}/kondisi');
        const kondisiData = await kondisiResponse.json();
        setKondisiList(kondisiData);

        const asetResponse = await fetch(`${process.env.REACT_APP_API_URL}/aset/${id}`);
        const asetData = await asetResponse.json();

        if (asetData) {
          setNamaBarang(asetData.namabarang);
          setKategori(asetData.kategori);
          setSubKategori(asetData.subkategori);
          setNoSeri(asetData.noseri);
          setTanggalMasuk(asetData.tanggalmasuk);
          setTanggalKeluar(asetData.tanggalkeluar);
          setLokasi(asetData.lokasi);
          setKondisiBarang(asetData.kondisibarang);
          setDokumentasi(asetData.dokumentasi);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

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

    if (!namaBarang || !kategori || !subKategori || !noSeri || !tanggalMasuk || !tanggalKeluar || !lokasi || !kondisiBarang) {
      alert('Data gagal diperbarui. Semua field harus diisi!');
      return;
    }

    if (new Date(tanggalKeluar) < new Date(tanggalMasuk)) {
      alert('Tanggal Keluar tidak bisa lebih awal dari Tanggal Masuk');
      return;
    }

    const formData = new FormData();
    formData.append('namabarang', namaBarang);
    formData.append('kategori', kategori);
    formData.append('subkategori', subKategori);
    formData.append('noseri', noSeri);
    formData.append('tanggalmasuk', tanggalMasuk);
    formData.append('tanggalkeluar', tanggalKeluar);
    formData.append('lokasi', lokasi);
    formData.append('kondisibarang', kondisiBarang);

    if (dokumentasi instanceof File) {
      formData.append('dokumentasi', dokumentasi);
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/aset/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        alert('Data berhasil diperbarui!');
        navigate('/aset');
      } else {
        alert('Data gagal diperbarui');
      }
    } catch (error) {
      console.error('Terjadi error saat mencoba memperbarui data:', error);
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

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor={isDarkMode ? "#0A1929" : "#f4f6f9"}
      padding="20px"
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
          maxWidth: '600px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Box mb={3} textAlign="center">
          <h1 style={{ color: theme.palette.text.primary }}>Edit Data Aset</h1>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nama Barang"
              fullWidth
              required
              value={namaBarang}
              onChange={(e) => setNamaBarang(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: isDarkMode ? '#fff' : '#000',
                  },
                  '&:hover fieldset': {
                    borderColor: isDarkMode ? '#fff' : '#000',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: isDarkMode ? '#fff' : '#000',
                  },
                },
                '& .MuiInputBase-input': {
                  color: isDarkMode ? '#fff' : '#000',
                },
                '& .MuiInputLabel-root': {
                  color: isDarkMode ? '#fff' : '#000',
                  fontSize: '14px',
                  top: '-5px',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: isDarkMode ? '#fff' : '#000',
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
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
                    borderColor: isDarkMode ? '#fff' : '#000',
                  },
                  '&:hover fieldset': {
                    borderColor: isDarkMode ? '#fff' : '#000',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: isDarkMode ? '#fff' : '#000',
                  },
                },
                '& .MuiInputBase-input': {
                  color: isDarkMode ? '#fff' : '#000',
                },
                '& .MuiInputLabel-root': {
                  color: isDarkMode ? '#fff' : '#000',
                  fontSize: '14px',
                  top: '-5px',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: isDarkMode ? '#fff' : '#000',
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
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
                    borderColor: isDarkMode ? '#fff' : '#000',
                  },
                  '&:hover fieldset': {
                    borderColor: isDarkMode ? '#fff' : '#000',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: isDarkMode ? '#fff' : '#000',
                  },
                },
                '& .MuiInputBase-input': {
                  color: isDarkMode ? '#fff' : '#000',
                },
                '& .MuiInputLabel-root': {
                  color: isDarkMode ? '#fff' : '#000',
                  fontSize: '14px',
                  top: '-5px',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: isDarkMode ? '#fff' : '#000',
                },
              }}
            />
          </Grid>

          {/* Pilih Kategori Dropdown */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="kategori-label" sx={{ color: isDarkMode ? '#fff' : '#000', top: '-5px', fontSize: '14px' }}>
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
                      borderColor: isDarkMode ? '#fff' : '#000',
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? '#fff' : '#000',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: isDarkMode ? '#fff' : '#000',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: isDarkMode ? '#fff' : '#000',
                  },
                  '& .MuiSvgIcon-root': {
                    color: isDarkMode ? '#fff' : '#000',
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: isDarkMode ? '#333' : '#fff',
                      '& .MuiMenuItem-root': {
                        color: isDarkMode ? '#fff' : '#000',
                      },
                      '& .MuiMenuItem-root.Mui-selected': {
                        backgroundColor: isDarkMode ? '#555' : '#ddd',
                      },
                    },
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

          {/* Pilih Subkategori Dropdown */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="subkategori-label" sx={{ color: isDarkMode ? '#fff' : '#000', top: '-5px', fontSize: '14px' }}>
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
                      borderColor: isDarkMode ? '#fff' : '#000',
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? '#fff' : '#000',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: isDarkMode ? '#fff' : '#000',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: isDarkMode ? '#fff' : '#000',
                  },
                  '& .MuiSvgIcon-root': {
                    color: isDarkMode ? '#fff' : '#000',
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: isDarkMode ? '#333' : '#fff',
                      '& .MuiMenuItem-root': {
                        color: isDarkMode ? '#fff' : '#000',
                      },
                      '& .MuiMenuItem-root.Mui-selected': {
                        backgroundColor: isDarkMode ? '#555' : '#ddd',
                      },
                    },
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

          {/* Pilih Kondisi Dropdown */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="kondisi-label" sx={{ color: isDarkMode ? '#fff' : '#000', top: '-5px', fontSize: '14px' }}>
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
                      borderColor: isDarkMode ? '#fff' : '#000',
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? '#fff' : '#000',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: isDarkMode ? '#fff' : '#000',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: isDarkMode ? '#fff' : '#000',
                  },
                  '& .MuiSvgIcon-root': {
                    color: isDarkMode ? '#fff' : '#000',
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: isDarkMode ? '#333' : '#fff',
                      '& .MuiMenuItem-root': {
                        color: isDarkMode ? '#fff' : '#000',
                      },
                      '& .MuiMenuItem-root.Mui-selected': {
                        backgroundColor: isDarkMode ? '#555' : '#ddd',
                      },
                    },
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

          {/* No. Seri Field */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="No. Seri"
              fullWidth
              required
              value={noSeri}
              onChange={(e) => setNoSeri(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: isDarkMode ? '#fff' : '#000',
                  },
                  '&:hover fieldset': {
                    borderColor: isDarkMode ? '#fff' : '#000',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: isDarkMode ? '#fff' : '#000',
                  },
                },
                '& .MuiInputBase-input': {
                  color: isDarkMode ? '#fff' : '#000',
                },
                '& .MuiInputLabel-root': {
                  color: isDarkMode ? '#fff' : '#000',
                  fontSize: '14px',
                  top: '-5px',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: isDarkMode ? '#fff' : '#000',
                },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center">
              <InputLabel style={{ marginRight: '10px', top: '-5px', color: isDarkMode ? '#fff' : '#000' }}>Dokumentasi</InputLabel>
              <Button
                variant="outlined"
                component="label"
                onKeyPress={handleKeyPressFileInput}
                sx={{
                  border: `1px solid ${isDarkMode ? '#fff' : '#000'}`,
                  borderRadius: '4px',
                  width: '100%',
                  textAlign: 'left',
                  justifyContent: 'flex-start',
                  color: isDarkMode ? '#fff' : '#000',
                }}
              >
                <AttachFileIcon style={{ marginRight: '10px', color: isDarkMode ? '#fff' : '#000' }} />
                {dokumentasi instanceof File ? dokumentasi.name : 'Pilih File'}
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

          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between">
              <Button
                variant="contained"
                color="error"
                onClick={() => navigate('/aset')}
                sx={{
                  borderRadius: '8px',
                  backgroundColor: '#d32f2f',
                }}
              >
                <ArrowBackIcon />
                Kembali
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                sx={{
                  borderRadius: '8px',
                  backgroundColor: '#388e3c',
                }}
              >
                <CheckIcon />
                Kirim
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default EditAset;
