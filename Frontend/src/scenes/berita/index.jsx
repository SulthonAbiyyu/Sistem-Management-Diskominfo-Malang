import Header from "../../components/Header";
import { Box, Button, TextField, Checkbox } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PrintIcon from '@mui/icons-material/Print';
import CheckIcon from '@mui/icons-material/Check';

const BeritaAcara = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [barang, setBarang] = useState([]); // State untuk barang
  const [selectedItems, setSelectedItems] = useState([]); // State untuk item yang di-checklist
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    namaPembuat: '',
    jabatan: ''
  });

  // Fetch data dari tabel barang
  useEffect(() => {
    const fetchBarang = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/aset`);
        const data = await response.json();
        setBarang(data); // Set data barang
      } catch (error) {
        console.error("Error fetching barang:", error);
      }
    };
    fetchBarang();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCheckboxChange = (id) => {
    setSelectedItems(prevSelectedItems =>
      prevSelectedItems.includes(id)
        ? prevSelectedItems.filter(item => item !== id)
        : [...prevSelectedItems, id]
    );
  };

  const handlePrint = () => {
    const selectedData = barang.filter(item => selectedItems.includes(item.id));
    const printContent = `
      <html>
        <head>
          <style>
            body {
              font-family: 'Calibri', sans-serif;
              margin: 1.75cm 2cm 1.5cm 2cm;
              font-size: 11pt;
              line-height: 1.5;
            }
            h2 {
              text-align: center;
              font-size: 12pt;
              font-weight: bold;
            }
            table, th, td {
              border: 1px solid black;
              border-collapse: collapse;
              padding: 8px;
              text-align: center;
            }
            .text-red {
              color: red;
              font-weight: bold;
            }
            .signature {
              margin-top: 40px;
              width: 100%;
              display: flex;
              justify-content: space-between;
            }
            .signature div {
              text-align: center;
              margin-top: 20px;
            }
            .signature div.signature-box {
              padding-top: 80px;
            }
            .date {
              text-align: right;
              margin-right: 10px;
              margin-bottom: -55px;
              display: flex;
              justify-content: flex-end;
            }
            p {
              margin: 0;
              padding: 0;
              margin-bottom: 10px;
            }

            strong {
              margin-right: 20px;
            }

            .nama {
              margin-right: 30px;
            }

          </style>
        </head>
        <body>
          <h2>BERITA ACARA SERAH TERIMA BARANG</h2>
          <p><strong class="nama">Nama</strong>: <span class="text-black">${formData.namaPembuat}</span></p>
          <p><strong>Jabatan</strong>: <span class="text-black">${formData.jabatan}</span></p>
          <p><strong>Instansi</strong>: Dinas Komunikasi dan Informatika, Kota Malang</p>
          <p>Selanjutnya disebut <strong>PIHAK KESATU</strong></p>
          <p><strong class="nama">Nama</strong>:  .....................................................................................................................................</p>
          <p><strong>Jabatan</strong>: .....................................................................................................................................</p>
          <p><strong>Instansi</strong>: .....................................................................................................................................</p>
          <p>Selanjutnya disebut <strong>PIHAK KEDUA</strong></p>
          <p>PIHAK KESATU menyerahkan barang berupa peralatan kepada PIHAK KEDUA dan PIHAK KEDUA menyatakan telah menerima barang dari PIHAK KESATU berupa:</p>
          <br />
          <table style="width: 100%;">
            <thead>
              <tr>
                <th>No</th>
                <th>Jenis Barang</th>
                <th>Jumlah Barang</th>
                <th>Kondisi Barang</th>
              </tr>
            </thead>
            <tbody>
              ${selectedData.map((item, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.namabarang}</td>
                  <td>${item.jumlah || 1}</td>
                  <td>${item.kondisibarang}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <br />
          <p>Demikian Berita Acara Serah Terima Barang ini dibuat oleh PARA PIHAK, adapun barang-barang tersebut diterima dalam keadaan baik dan cukup, maka sejak ditandatanganinya berita acara ini oleh PIHAK KEDUA maka barang tersebut menjadi tanggung jawab PIHAK KEDUA untuk memelihara/merawat dengan baik.</p>
          <div class="date">
            <div>
              <p>Malang,</p>
            </div>
            <div style="margin-left: 115px;">
            <p>${new Date().getFullYear()}</p>
            </div>
          </div>
          <div class="signature">
            <div>
              <p><strong>PIHAK KESATU,</strong></p>
              <div class="signature-box">( <span class="text-black">${formData.namaPembuat}</span> )</div>
            </div>
            <div>
              <p><strong>PIHAK KEDUA,</strong></p>
              <div class="signature-box">( .......................... )</div>
            </div>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };
  
  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const handleClick = () => {
    // Logic for button click
  };

  // Generate columns untuk DataGrid
  const columns = [
    {
      field: "checkbox",
      headerName: "",
      flex: 0.5,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Checkbox
          checked={selectedItems.includes(params.row.id)}
          onChange={() => handleCheckboxChange(params.row.id)}
        />
      ),
    },
    {
      field: "namabarang",
      headerName: "Nama Barang",
      flex: 2.5,
      cellClassName: "name-column--cell",
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: "kondisibarang",
      headerName: "Kondisi Barang",
      flex: 1,
    },
  ];
  
  const getTextFieldStyles = (mode) => ({
    color: mode === 'dark' ? '#FFFFFF' : '#000000',
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: mode === 'dark' ? '#90CAF9' : '#0A285F',
        borderRadius: '10px',
        borderWidth: '2px',
      },
      '&:hover fieldset': {
        borderColor: mode === 'dark' ? '#64B5F6' : '#0A285F',
      },
      '&.Mui-focused fieldset': {
        borderColor: mode === 'dark' ? '#2196F3' : '#0A285F',
        borderWidth: '3px',
      },
    },
    '& input': {
      color: mode === 'dark' ? '#FFFFFF' : '#000000',
    },
    '& .MuiInputLabel-root': {
      color: mode === 'dark' ? '#FFFFFF' : '#000000',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: mode === 'dark' ? '#FFFFFF' : '#000000',
    }
  });

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" alignItems="center">
          <Header title="Berita Acara" sx={{ fontSize: '24px', fontWeight: 'bold', color: '#0A285F' }} />
        </Box>

        <Box display="flex" justifyContent="flex-end" alignItems="center">
        <Button
          variant="contained"
          onClick={handleBack}
          startIcon={<ArrowBackIcon />}
          sx={{
            backgroundColor: theme.palette.mode === 'dark' ? '#005a5b' : '#009698',
            fontSize: '18px',
            fontWeight: 'bold',
            padding: "8px 16px",  
            mr: 2,
            '&:hover': {
              backgroundColor: theme.palette.mode === 'dark' ? '#009698' : '#005a5b',
            },
            color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
          }}
        >
          Kembali
        </Button>

        <Button
          variant="contained"
          onClick={handlePrint}
          startIcon={<PrintIcon />} 
          sx={{
            backgroundColor: theme.palette.mode === 'dark' ? '#347f6b' : '#4cceac',
            fontSize: '18px',
            fontWeight: 'bold',
            padding: "8px 16px",  
            mr: 2,
            '&:hover': {
              backgroundColor: theme.palette.mode === 'dark' ? '#4cceac' : '#347f6b',
            },
            color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
          }}
        >
          Print
        </Button>

        {/* <Button
          variant="contained"
          startIcon={<CheckIcon/>}
          onClick={handleClick}
          sx={{
            backgroundColor: theme.palette.mode === 'dark' ? '#005a5b' : '#009698',
            fontSize: '18px',
            fontWeight: 'bold',
            padding: "8px 16px", 
            mr: 2,
            '&:hover': {
              backgroundColor: theme.palette.mode === 'dark' ? '#4cceac' : '#347f6b',
            },
            color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
          }}
        >
          Buat
        </Button> */}

      </Box>
    </Box>

      {/* TextField for Nama Pembuat and Jabatan */}
      <Box display="flex" justifyContent="space-between" mb={3} alignItems="center">
        <TextField
          label="Nama Pembuat"
          name="namaPembuat"
          value={formData.namaPembuat}
          onChange={handleInputChange}
          size="small"
          variant="outlined"
          InputLabelProps={{
            sx: {
              color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
            },
          }}
          sx={getTextFieldStyles(theme.palette.mode)}
          fullWidth
        />

        <TextField
          label="Jabatan"
          name="jabatan"
          value={formData.jabatan}
          onChange={handleInputChange}
          size="small"
          variant="outlined"
          InputLabelProps={{
            sx: {
              color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
            },
          }}
          sx={getTextFieldStyles(theme.palette.mode)}
          fullWidth
        />
      </Box>

      <Box
        m="20px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
            lineHeight: "1.5 !important",
            paddingTop: "10px",
            paddingBottom: "10px",
            backgroundColor: theme.palette.mode === "dark" ? colors.grey[1300] : colors.bgcolor[200],
          },
          "& .name-column--cell": {
            color: theme.palette.mode === 'dark' ? 'white' : 'black', 
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.mode === "dark" ? colors.grey[1100] : colors.grey[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.mode === "dark" ? colors.grey[1300] : colors.bgcolor[200],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: theme.palette.mode === "dark" ? colors.grey[1100] : colors.grey[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: colors.grey[100],
          },
          "& .MuiDataGrid-toolbarContainer": {
            color: "black !important",
          },
        }}
      >
        <DataGrid
          rows={barang}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.id} 
          rowHeight={75}
        />
      </Box>
    </Box>
  );
};

export default BeritaAcara;
