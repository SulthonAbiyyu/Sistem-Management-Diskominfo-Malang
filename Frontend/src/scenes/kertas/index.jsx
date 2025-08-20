import React, { useState } from "react";
import { Box, Button, TextField, Checkbox, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material";

const BeritaAcaraSerahTerima = () => {
  const [namaPembuat, setNamaPembuat] = useState("");
  const [barangList, setBarangList] = useState([]);
  const [currentBarang, setCurrentBarang] = useState({
    jenisBarang: "",
    jumlahBarang: "",
    kondisiBarang: "",
    selected: false,
  });

  const handlePrint = () => {
    window.print();
  };

  const handleAddBarang = () => {
    if (currentBarang.jenisBarang && currentBarang.jumlahBarang && currentBarang.kondisiBarang) {
      setBarangList([...barangList, { ...currentBarang }]);
      setCurrentBarang({
        jenisBarang: "",
        jumlahBarang: "",
        kondisiBarang: "",
        selected: false,
      });
    }
  };

  const handleCheckboxChange = (index) => {
    const updatedBarangList = barangList.map((item, i) =>
      i === index ? { ...item, selected: !item.selected } : item
    );
    setBarangList(updatedBarangList);
  };

  return (
    <Box m="20px" p="20px" border="1px solid black">
      <h1 style={{ textAlign: "center" }}>BERITA ACARA SERAH TERIMA BARANG</h1>

      {/* Input Form */}
      <TextField
        label="Nama Pembuat"
        value={namaPembuat}
        onChange={(e) => setNamaPembuat(e.target.value)}
        fullWidth
        sx={{ marginBottom: "20px" }}
      />
      <Box display="flex" gap="20px" marginBottom="20px">
        <TextField
          label="Jenis Barang"
          value={currentBarang.jenisBarang}
          onChange={(e) => setCurrentBarang({ ...currentBarang, jenisBarang: e.target.value })}
          fullWidth
        />
        <TextField
          label="Jumlah Barang"
          value={currentBarang.jumlahBarang}
          onChange={(e) => setCurrentBarang({ ...currentBarang, jumlahBarang: e.target.value })}
          fullWidth
        />
        <TextField
          label="Kondisi Barang"
          value={currentBarang.kondisiBarang}
          onChange={(e) => setCurrentBarang({ ...currentBarang, kondisiBarang: e.target.value })}
          fullWidth
        />
      </Box>
      <Button variant="contained" color="primary" onClick={handleAddBarang}>
        Tambah Barang
      </Button>

      {/* Tabel Barang */}
      <Table sx={{ marginTop: "20px" }}>
        <TableHead>
          <TableRow>
            <TableCell>Ceklis</TableCell>
            <TableCell>No.</TableCell>
            <TableCell>Jenis Barang</TableCell>
            <TableCell>Jumlah Barang</TableCell>
            <TableCell>Kondisi Barang</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {barangList.map((barang, index) => (
            <TableRow key={index}>
              <TableCell>
                <Checkbox
                  checked={barang.selected}
                  onChange={() => handleCheckboxChange(index)}
                />
              </TableCell>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{barang.jenisBarang}</TableCell>
              <TableCell>{barang.jumlahBarang}</TableCell>
              <TableCell>{barang.kondisiBarang}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Tanda Tangan */}
      <Box sx={{ marginTop: "40px" }}>
        <p>Nama Pembuat: {namaPembuat}</p>
      </Box>

      {/* Tombol Print */}
      <Button
        variant="contained"
        color="primary"
        onClick={handlePrint}
        sx={{ marginTop: "20px", fontSize: "16px", padding: "10px 20px" }}
      >
        Print
      </Button>
    </Box>
  );
};

export default BeritaAcaraSerahTerima;
