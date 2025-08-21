import Header from "../../components/Header";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import ProgressCircle from "../../components/ProgressCircle";
import Bar from "../bar";
import { useState, useEffect } from "react";
import { DataGrid, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from "@mui/x-data-grid";
import GetAppIcon from '@mui/icons-material/GetApp';
import * as XLSX from 'xlsx';

// Fungsi untuk menghasilkan warna secara dinamis menggunakan HSL
const generateColor = (index) => {
  const hue = (index * 137.5) % 360; // Menggunakan sudut phi untuk distribusi warna yang lebih merata
  return `hsl(${hue}, 70%, 50%)`; // Saturasi dan lightness diatur agar tidak terlalu terang
};

// CustomToolbar Component
const CustomToolbar = ({ onExport }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton sx={{ color: isDarkMode ? '#ffffff' : 'inherit' }} />
      <GridToolbarFilterButton sx={{ color: isDarkMode ? '#ffffff' : 'inherit' }} />
      <GridToolbarDensitySelector sx={{ color: isDarkMode ? '#ffffff' : 'inherit' }} />
      <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', ml: 1 }} onClick={onExport}>
        <GetAppIcon sx={{ color: isDarkMode ? '#ffffff' : 'inherit' }} />
        <Typography sx={{ color: isDarkMode ? '#ffffff' : 'inherit', ml: 0.5 }}>Export</Typography>
      </Box>
    </GridToolbarContainer>
  );
};

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [aset, setAset] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [subkategoriList, setSubkategoriList] = useState([]);
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [kondisiBarang, setKondisiBarang] = useState([]);

  // Fetch aset data
  useEffect(() => {
    const fetchAset = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/aset`);
        const data = await response.json();
        setAset(data);
      } catch (error) {
        console.error("Error fetching aset:", error);
      }
    };

    fetchAset();
  }, []);

  // Fetch kategori data
  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/kategori`);
        const data = await response.json();
        setKategoriList(data);
      } catch (error) {
        console.error("Error fetching kategori:", error);
      }
    };
    fetchKategori();
  }, []);

  useEffect(() => {
    const fetchSubkategori = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/subkategori`);
        const data = await response.json();
        setSubkategoriList(data);
      } catch (error) {
        console.error("Error fetching subkategori:", error);
      }
    };
    fetchSubkategori();
  }, []);

  // Fetch kondisi barang
  useEffect(() => {
    const fetchKondisi = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/kondisi`);
        const data = await response.json();
        setKondisiBarang(data);
      } catch (error) {
        console.error("Error fetching kondisi barang:", error);
      }
    };

    fetchKondisi();
  }, []);

  const getKategoriName = (kategoriId) => {
    const kategoriItem = kategoriList.find(item => item.id === parseInt(kategoriId));
    return kategoriItem ? kategoriItem.namakategori : 'Tidak ada kategori';
  };

  const getSubkategoriName = (subkategoriId) => {
    const subkategoriItem = subkategoriList.find(item => item.id === parseInt(subkategoriId));
    return subkategoriItem ? subkategoriItem.namasubkategori : 'Tidak ada subkategori';
  };

  // Grouping aset data by kategori and subkategori
  const groupedData = aset.reduce((acc, item) => {
    const key = `${item.kategori}-${item.subkategori}`;
    if (!acc[key]) {
      acc[key] = {
        ...item,
        totalaset: 0,
      };
    }
    acc[key].totalaset += 1;
    return acc;
  }, {});

  const rows = Object.values(groupedData);

  const columns = [
    {
      field: "id",
      headerName: "NO",
      flex: 0.5,
      valueGetter: (params) => params.api.getRowIndex(params.id) + 1
    },
    {
      field: "kategori",
      headerName: "Kategori",
      flex: 1,
      valueGetter: (params) => getKategoriName(params.row.kategori)
    },
    {
      field: "subkategori",
      headerName: "Sub. Kategori",
      flex: 1,
      valueGetter: (params) => getSubkategoriName(params.row.subkategori)
    },
    {
      field: "totalaset",
      headerName: "Total Aset Diterima",
      flex: 1,
    },
  ];

  const handleExport = () => {
    const asetWithNumbering = rows.map((item, index) => {
      const { id, kategori, subkategori, ...rest } = item;
      return {
        no: index + 1,
        namabarang: item.namabarang,
        kategori: getKategoriName(kategori),
        subkategori: getSubkategoriName(subkategori),
        ...rest
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(asetWithNumbering);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Daftar Aset");

    XLSX.writeFile(workbook, "Daftar_Aset.xlsx");
  };

  const totalAset = aset.length;

  const boxBackgroundColor = theme.palette.mode === 'light' ? colors.bgcolor[200] : colors.grey[1100];
  const titleColor = theme.palette.mode === 'light' ? "#000000" : "#FFFFFF";

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box mb="30px">
        <Header title="BERANDA" subtitle="" />
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gap="20px"
        sx={{
          '@media (max-width: 960px)': {
            gridTemplateColumns: "1fr",
            gridTemplateRows: "auto",
          },
        }}
      >
        {/* ROW 1 - Donut Chart */}
        <Box
          gridColumn="span 6"
          gridRow="span 3"
          backgroundColor={boxBackgroundColor}
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          p="20px"
          borderRadius="16px"
          sx={{
            '@media (max-width: 960px)': {
              gridColumn: "span 12",
            },
          }}
        >
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography
              variant="h3"
              color={titleColor}
              fontWeight="bold"
              sx={{
                fontSize: { xs: '20px', sm: '24px', md: '28px', lg: '32px' },
                marginBottom: '10px',
              }}
            >
              Jumlah Aset
            </Typography>
            <ProgressCircle
              kondisiBarang={kondisiBarang}
              aset={aset}
              size={200}
              thickness={50}
              isDonut={true}
              totalAset={totalAset}
              setHoveredSegment={setHoveredSegment}
              hoveredSegment={hoveredSegment}
              hideLegend={true}
              tooltipContent={null}
            />
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            ml="20px"
            sx={{
              fontSize: { xs: '14px', sm: '16px', md: '18px', lg: '20px' },
            }}
          >
            {kondisiBarang.map((kondisi, index) => (
              <Box display="flex" justifyContent="space-between" width="100%" key={index}>
                <Typography variant="h6" style={{ color: generateColor(index) }} fontSize="18px">
                  {kondisi.kondisibarang}
                </Typography>
                <Typography variant="h6" style={{ color: generateColor(index) }} ml="10px" fontSize="18px">
                  {aset.filter(item => item.kondisibarang === kondisi.kondisibarang).length}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* ROW 2 - Bar Chart */}
        <Box
          gridColumn="span 6"
          gridRow="span 3"
          backgroundColor={boxBackgroundColor}
          p="20px"
          borderRadius="16px"
          sx={{
            '@media (max-width: 960px)': {
              gridColumn: "span 12",
            },
          }}
        >
          <Typography
            variant="h5"
            color={titleColor}
            fontWeight="600"
            mb="40px"
          >
            Data Pemakai
          </Typography>
          <Box height="100%">
            <Bar />
          </Box>
        </Box>

      </Box>

      {/* DataGrid Section */}
      <Box m="20px 0 0 0">
        <Box mb="30px">
          <Header title="Jumlah Aset" />
        </Box>
        <Box
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
              color: colors.grey[1300],
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: theme.palette.mode === "dark" ? colors.grey[1100] : colors.grey[700],
              borderBottom: "none",
              borderRadius: "16px 16px 0 0",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: theme.palette.mode === "dark" ? colors.grey[1300] : colors.bgcolor[200],
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: theme.palette.mode === "dark" ? colors.grey[1100] : colors.grey[700],
              borderRadius: "0 0 16px 16px",
            },
            "& .MuiCheckbox-root": {
              color: `${colors.greenAccent[200]} !important`,
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: colors.grey[100],
            },
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            components={{ Toolbar: CustomToolbar }}
            rowHeight={75}
            componentsProps={{
              toolbar: { onExport: handleExport }
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
