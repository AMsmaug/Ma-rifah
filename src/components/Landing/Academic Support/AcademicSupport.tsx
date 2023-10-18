import "./academicSupport.css";
import { Box, Grid, Typography } from "@mui/material";

const AcademicSupport = () => {
  return (
    <Box className="academic-support" pt={3} pb={7}>
      <Box className="container">
        <h2 className="main-title">Academic Support</h2>
        <Typography
          variant="h4"
          className="under-title"
          textAlign="center"
          mb={2}
        >
          Courses
        </Typography>
        <Grid container justifyContent="space-between" rowGap={2} mt={4}>
          <Grid
            item
            xs={5.85}
            sm={3.85}
            md={1.85}
            lg={1.85}
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="white"
            height="175px"
            className="material"
            sx={{ borderRadius: "6px" }}
          >
            <Box>Mathematics</Box>
          </Grid>
          <Grid
            item
            xs={5.85}
            sm={3.85}
            md={1.85}
            lg={1.85}
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="white"
            height="175px"
            className="material"
            sx={{ borderRadius: "6px" }}
          >
            <Box>Physics</Box>
          </Grid>
          <Grid
            item
            xs={5.85}
            sm={3.85}
            md={1.85}
            lg={1.85}
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="white"
            height="175px"
            className="material"
            sx={{ borderRadius: "6px" }}
          >
            <Box>Chemistery</Box>
          </Grid>
          <Grid
            item
            xs={5.85}
            sm={3.85}
            md={1.85}
            lg={1.85}
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="white"
            height="175px"
            className="material"
            sx={{ borderRadius: "6px" }}
          >
            <Box>Biology</Box>
          </Grid>
          <Grid
            item
            xs={5.85}
            sm={3.85}
            md={1.85}
            lg={1.85}
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="white"
            height="175px"
            className="material"
            sx={{ borderRadius: "6px" }}
          >
            <Box>Arabic</Box>
          </Grid>
          <Grid
            item
            xs={5.85}
            sm={3.85}
            md={1.85}
            lg={1.85}
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="white"
            height="175px"
            className="material"
            sx={{ borderRadius: "6px" }}
          >
            <Box>French</Box>
          </Grid>
          <Grid
            item
            xs={5.85}
            sm={3.85}
            md={1.85}
            lg={1.85}
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="white"
            height="175px"
            className="material"
            sx={{ borderRadius: "6px" }}
          >
            <Box>English</Box>
          </Grid>
          <Grid
            item
            xs={5.85}
            sm={3.85}
            md={1.85}
            lg={1.85}
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="white"
            height="175px"
            className="material"
            sx={{ borderRadius: "6px" }}
          >
            <Box>Social Studies</Box>
          </Grid>
          <Grid
            item
            xs={5.85}
            sm={3.85}
            md={1.85}
            lg={1.85}
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="white"
            height="175px"
            className="material"
            sx={{ borderRadius: "6px" }}
          >
            <Box>History</Box>
          </Grid>
          <Grid
            item
            xs={5.85}
            sm={3.85}
            md={1.85}
            lg={1.85}
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="white"
            height="175px"
            className="material"
            sx={{ borderRadius: "6px" }}
          >
            <Box>Geography</Box>
          </Grid>
          <Grid
            item
            xs={5.85}
            sm={3.85}
            md={1.85}
            lg={1.85}
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="white"
            height="175px"
            className="material"
            sx={{ borderRadius: "6px" }}
          >
            <Box>Cyvics</Box>
          </Grid>
          <Grid
            item
            xs={5.85}
            sm={3.85}
            md={1.85}
            lg={1.85}
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="white"
            height="175px"
            className="material"
            sx={{ borderRadius: "6px" }}
          >
            <Box>Economy</Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AcademicSupport;
