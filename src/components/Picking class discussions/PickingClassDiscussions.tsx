import "./pickingClassDiscussion.css";
import { Stack, Box, Typography } from "@mui/material";
import { Header } from "../Header/Header";
import Footer from "../Footer/Footer";
import { useNavigate } from "react-router-dom";

const PickingClassDiscussions = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/Q&A");
  };

  return (
    <Box className="class-discussion-picker">
      <Header />
      <Box
        className="container"
        textAlign="center"
        mt="200px"
        sx={{ minHeight: "480px" }}
      >
        <Typography mb={3} variant="h5">
          Which class would you like to see its students discussions ?
        </Typography>
        <Stack spacing={3} maxWidth="500px" sx={{ margin: "50px auto" }}>
          <Box
            p={3}
            fontSize="20px"
            sx={{
              border: "2px solid",
              cursor: "pointer",
              transition: ".3s",
              borderRadius: "8px",
              "&:hover": {
                borderColor: "secondary.main",
                bgcolor: "primary.main",
                color: "white",
              },
            }}
            borderColor="secondary.main"
            onClick={handleClick}
          >
            Grade - 12 (SG)
          </Box>
          <Box
            p={3}
            fontSize="20px"
            sx={{
              border: "2px solid",
              cursor: "pointer",
              transition: ".3s",
              borderRadius: "8px",
              "&:hover": {
                borderColor: "secondary.main",
                bgcolor: "primary.main",
                color: "white",
              },
            }}
            borderColor="secondary.main"
            onClick={handleClick}
          >
            Grade - 12 (SV)
          </Box>
          <Box
            p={3}
            fontSize="20px"
            sx={{
              border: "2px solid",
              cursor: "pointer",
              transition: ".3s",
              borderRadius: "8px",
              "&:hover": {
                borderColor: "secondary.main",
                bgcolor: "primary.main",
                color: "white",
              },
            }}
            borderColor="secondary.main"
            onClick={handleClick}
          >
            Grade - 12 (SE)
          </Box>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default PickingClassDiscussions;
