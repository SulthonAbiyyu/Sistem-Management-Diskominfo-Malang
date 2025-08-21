import { useState, useEffect } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";

const BarChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);

  // Fetch data from backend
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/users/status`)
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setData(data);
        } else {
          console.error('Data yang diterima bukan array:', data);
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <ResponsiveBar
      data={data}
      keys={['adminOnline', 'adminOffline', 'operatorOnline', 'operatorOffline']} // Kunci sesuai data dari server
      indexBy="status" // Menggunakan 'status' sebagai indeks
      layout="horizontal" // Layout horizontal
      margin={{ top: 50, right: 30, bottom: 50, left: 30 }} // Penyesuaian margin
      padding={0.3} // Padding antar bar
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={({ data }) => data.color} // Warna bar berdasarkan data
      borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}

      // Grid sumbu yang sesuai
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5, // Menghilangkan tick di sumbu bawah
        tickPadding: 5, // Tidak ada jarak di sumbu bawah
        tickRotation: 0,
        legend: '', // Tidak ada label di sumbu bawah
        legendPosition: 'middle',
        legendOffset: 32,
      }}
      axisLeft={null} // Menghilangkan semua teks dan label di sumbu kiri

      
      enableGridY={false} // Mengaktifkan grid Y (garis vertikal)
      enableGridX={true} // Mengaktifkan grid X (garis horizontal)

      enableLabel={true} // Aktifkan label di dalam bar
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor="white" // Warna teks label putih
      label={({ indexValue, value }) => `${indexValue} ${value}`} // Menampilkan teks di samping angka di dalam bar

      theme={{
        textColor: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
        fontSize: 12, // Kecilkan font size
        fontWeight: 'bold', // Tebalkan font
        tooltip: {
          container: {
            background: theme.palette.mode === 'dark' ? colors.grey[900] : '#ffffff',
            color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
          },
        },
      }}
      role="application"
      barAriaLabel={function (e) {
        return `${e.id}: ${e.formattedValue} in status: ${e.indexValue}`;
      }}
    />
  );
};

export default BarChart;
