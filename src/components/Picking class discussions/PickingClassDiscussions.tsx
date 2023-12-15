import "./pickingClassDiscussion.css";
import { Stack, Box, Typography } from "@mui/material";
import { Header } from "../LandingHeader/Header";
import Footer from "../Footer/Footer";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Skeleton from "@mui/material/Skeleton";
import Snackbar from "@mui/material/Snackbar";
import { SnackbarAlert } from "../custom snack bar/SnackbarAlert";

type Classes = {
  class_id: number;
  class_name: string;
}[];

const PickingClassDiscussions = () => {
  const [classes, setclasses] = useState<Classes>([]);

  const [loading, setloading] = useState<boolean>(true);

  const [isFetchingError, setisFetchingError] = useState<boolean>(false);
  const [errorMessage, seterrorMessage] = useState<string>("");

  const navigate = useNavigate();

  const handleClick = (class_id: number) => {
    navigate("/Q&A", { state: { class_id: class_id } });
  };

  const handleCloseAlert = () => {
    setisFetchingError(false);
    seterrorMessage("");
  };

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get(
          "http://localhost/Ma-rifah/get_classes.php"
        );

        console.log(res);

        if (res.data.status === "success") {
          setclasses(res.data.payload);
        } else {
          setisFetchingError(true);
          seterrorMessage(res.data.message || "Error during the request");
        }

        setloading(false);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setisFetchingError(true);
        seterrorMessage("There was an error during the request");
      }
    };

    fetchClasses();
  }, []);

  return (
    <Box className="class-discussion-picker">
      <Header />
      <Box
        className="container"
        textAlign="center"
        mt="200px"
        sx={{ minHeight: "480px" }}
      >
        {isFetchingError && (
          <Snackbar
            open={isFetchingError}
            autoHideDuration={3000}
            onClose={handleCloseAlert}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <SnackbarAlert
              onClose={handleCloseAlert}
              severity="error"
              sx={{ padding: "12px 15px", fontSize: "17px" }}
            >
              {errorMessage}
            </SnackbarAlert>
          </Snackbar>
        )}
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
