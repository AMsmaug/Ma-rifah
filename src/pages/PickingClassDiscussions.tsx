import "../components/Picking class discussions/pickingClassDiscussion.css";
import { Stack, Box, Typography } from "@mui/material";
import { Header } from "../components/LandingHeader/Header";
import Footer from "../components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Skeleton from "@mui/material/Skeleton";

type Classes = {
  class_id: number;
  class_name: string;
}[];

const PickingClassDiscussions = () => {
  const [classes, setclasses] = useState<Classes>([]);

  const [loading, setloading] = useState<boolean>(true);

  const navigate = useNavigate();

  const handleClick = (class_id: number) => {
    navigate("/Q&A", { state: { class_id: class_id } });
  };

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get(
          "http://localhost/Ma-rifah/get_classes.php"
        );

        console.log(res.data.payload);

        if (res.data.status === "success") {
          setclasses(res.data.payload);
        }
        setloading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchClasses();
  }, []);

  console.log(classes);

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
          {loading ? (
            <LoadingComponent />
          ) : (
            classes.map((c, i) => (
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
            ))
          )}
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

const LoadingComponent = () => {
  return (
    <>
      <Skeleton
        variant="rectangular"
        animation="wave"
        sx={{
          padding: "3rem",
          border: "2px solid",
          cursor: "pointer",
          borderRadius: "8px",
        }}
      ></Skeleton>
      <Skeleton
        variant="rectangular"
        animation="wave"
        sx={{
          padding: "3rem",
          border: "2px solid",
          cursor: "pointer",
          borderRadius: "8px",
        }}
      ></Skeleton>
      <Skeleton
        variant="rectangular"
        animation="wave"
        sx={{
          padding: "3rem",
          border: "2px solid",
          cursor: "pointer",
          borderRadius: "8px",
        }}
      ></Skeleton>
    </>
  );
};

export default PickingClassDiscussions;
