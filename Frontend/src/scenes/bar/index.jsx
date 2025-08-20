import { Box } from "@mui/material";
import Header from "../../components/Header";
import BarChart from "../../components/BarChart";

const Bar = () => {
  return (
    <Box m="-30px">
      <Header  />
      <Box height="50vh">
        <BarChart />
      </Box>
    </Box>
  );
};

export default Bar;
