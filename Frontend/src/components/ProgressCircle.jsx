import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import { Box, Typography, useTheme } from '@mui/material';

// Fungsi untuk menghasilkan warna secara dinamis menggunakan HSL
const generateColor = (index) => {
  const hue = (index * 137.5) % 360; // Menggunakan sudut phi untuk distribusi warna yang lebih merata
  return `hsl(${hue}, 70%, 50%)`; // Saturasi dan lightness diatur agar tidak terlalu terang
};

const ProgressCircle = ({ kondisiBarang, aset, size, thickness, isDonut, totalAset, setHoveredSegment, hoveredSegment }) => {
  const theme = useTheme();
  const titleColor = theme.palette.mode === 'light' ? '#000000' : '#FFFFFF';

  // Data untuk donut chart besar dengan warna yang dihasilkan secara dinamis
  const progressDataBesar = kondisiBarang.map((kondisi, index) => ({
    id: kondisi.kondisibarang,
    value: aset.filter(item => item.kondisibarang === kondisi.kondisibarang).length,
    label: kondisi.kondisibarang,
    color: generateColor(index),  // Menghasilkan warna berdasarkan indeks kondisi
  }));

  return (
    <Box position="relative" height={`${size}px`} width={`${size}px`} display="flex" alignItems="center" justifyContent="center">
      <ResponsivePie
        data={progressDataBesar}
        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
        innerRadius={1 - thickness / size}
        padAngle={4}
        cornerRadius={4}
        activeOuterRadiusOffset={8}
        colors={{ datum: 'data.color' }}
        borderWidth={1}
        borderColor={{
          from: 'color',
          modifiers: [['darker', 0.2]]
        }}
        enableArcLinkLabels={false} // Disable Arc Link Labels
        enableArcLabels={false} // Disable Arc Labels
        tooltip={() => null} // Disable built-in tooltips completely
        onMouseEnter={(data) => setHoveredSegment(data)}
        onMouseLeave={() => setHoveredSegment(null)}
      />
      {isDonut && (
        <>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '75px',
              fontWeight: 'bold',
              color: titleColor,
              textAlign: 'center',
            }}
          >
            {totalAset}
          </div>
          {hoveredSegment && (
            <div
              style={{
                position: 'absolute',
                left: `calc(50% + ${Math.cos((hoveredSegment.startAngle + hoveredSegment.endAngle) / 2) * size / 3}px)`,
                top: `calc(50% + ${Math.sin((hoveredSegment.startAngle + hoveredSegment.endAngle) / 2) * size / 3}px)`,
                transform: 'translate(-50%, -50%)',
                backgroundColor: hoveredSegment.data.color,
                color: '#fff',
                borderRadius: '4px',
                padding: '5px 10px',
                whiteSpace: 'nowrap',
                transition: 'all 0.3s ease',
                pointerEvents: 'none',
                zIndex: 1000,
              }}
            >
              {`${hoveredSegment.data.label}: ${hoveredSegment.data.value}`}
            </div>
          )}
        </>
      )}
    </Box>
  );
};

export default ProgressCircle;
