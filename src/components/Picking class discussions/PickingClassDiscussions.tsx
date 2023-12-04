import "./pickingClassDiscussion.css";
import { Stack, Box, Typography } from "@mui/material";
import { Header } from "../LandingHeader/Header";
import Footer from "../Footer/Footer";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const clss = [
  {
    class_id: 1,
    class_name: "Grade - 12 (SG)",
  },
  {
    class_id: 2,
    class_name: "Grade - 12 (SV)",
  },
  {
    class_id: 3,
    class_name: "Grade - 12 (SE)",
  },
];

type Classes = {
  class_id: number;
  class_name: string;
}[];

const PickingClassDiscussions = () => {
  const [classes] = useState<Classes>(clss);

  const navigate = useNavigate();

  const handleClick = (class_id: number) => {
    navigate("/Q&A", { state: { class_id: class_id } });
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
          {classes.map((c, i) => (
            <Box
              key={i}
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
              onClick={() => handleClick(c.class_id)}
            >
              {c.class_name}
            </Box>
          ))}
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default PickingClassDiscussions;
