import "./academicSupport.css";
import { Box, Grid, Typography } from "@mui/material";

const AcademicSupport = () => {
  return (
    <Box
      className="academic-support section"
      id="Academic-Support"
      pt={3}
      pb={7}
    >
      <Box className="container">
        <h2 className="main-title">Academic Support</h2>
        <Typography
          variant="h4"
          className="under-title"
          textAlign="center"
          mb={2}
          color="primary.main"
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
            bgcolor="secondary.main"
            sx={{
              overflow: `hidden`,
              borderRadius: "6px",
              position: `relative`,
              "&:before": {
                content: `""`,
                position: `absolute`,
                left: 0,
                bottom: 0,
                height: 0,
                width: `4px`,
                transition: `1s`,
                bgcolor: `#fca311`,
              },
              "&:after": {
                content: `""`,
                position: `absolute`,
                right: 0,
                top: 0,
                height: 0,
                width: `4px`,
                transition: `1s`,
                bgcolor: `#fca311`,
              },
              "&:hover": {
                "&:before": {
                  height: `100%`,
                },
                "&:after": {
                  height: `100%`,
                },
              },
            }}
          >
            <Box className="material-name">Mathematics</Box>
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
            sx={{
              overflow: `hidden`,
              borderRadius: "6px",
              position: `relative`,
              "&:before": {
                content: `""`,
                position: `absolute`,
                left: 0,
                bottom: 0,
                height: 0,
                width: `4px`,
                transition: `1s`,
                bgcolor: `#fca311`,
              },
              "&:after": {
                content: `""`,
                position: `absolute`,
                right: 0,
                top: 0,
                height: 0,
                width: `4px`,
                transition: `0.3s`,
                bgcolor: `#fca311`,
              },
              "&:hover": {
                "&:before": {
                  height: `100%`,
                },
                "&:after": {
                  height: `100%`,
                },
              },
            }}
            bgcolor="secondary.main"
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
            sx={{
              overflow: `hidden`,
              borderRadius: "6px",
              position: `relative`,
              "&:before": {
                content: `""`,
                position: `absolute`,
                left: 0,
                bottom: 0,
                height: 0,
                width: `4px`,
                transition: `1s`,
                bgcolor: `#fca311`,
              },
              "&:after": {
                content: `""`,
                position: `absolute`,
                right: 0,
                top: 0,
                height: 0,
                width: `4px`,
                transition: `0.3s`,
                bgcolor: `#fca311`,
              },
              "&:hover": {
                "&:before": {
                  height: `100%`,
                },
                "&:after": {
                  height: `100%`,
                },
              },
            }}
            bgcolor="secondary.main"
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
            sx={{
              overflow: `hidden`,
              borderRadius: "6px",
              position: `relative`,
              "&:before": {
                content: `""`,
                position: `absolute`,
                left: 0,
                bottom: 0,
                height: 0,
                width: `4px`,
                transition: `1s`,
                bgcolor: `#fca311`,
              },
              "&:after": {
                content: `""`,
                position: `absolute`,
                right: 0,
                top: 0,
                height: 0,
                width: `4px`,
                transition: `0.3s`,
                bgcolor: `#fca311`,
              },
              "&:hover": {
                "&:before": {
                  height: `100%`,
                },
                "&:after": {
                  height: `100%`,
                },
              },
            }}
            bgcolor="secondary.main"
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
            sx={{
              overflow: `hidden`,
              borderRadius: "6px",
              position: `relative`,
              "&:before": {
                content: `""`,
                position: `absolute`,
                left: 0,
                bottom: 0,
                height: 0,
                width: `4px`,
                transition: `1s`,
                bgcolor: `#fca311`,
              },
              "&:after": {
                content: `""`,
                position: `absolute`,
                right: 0,
                top: 0,
                height: 0,
                width: `4px`,
                transition: `0.3s`,
                bgcolor: `#fca311`,
              },
              "&:hover": {
                "&:before": {
                  height: `100%`,
                },
                "&:after": {
                  height: `100%`,
                },
              },
            }}
            bgcolor="secondary.main"
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
            sx={{
              overflow: `hidden`,
              borderRadius: "6px",
              position: `relative`,
              "&:before": {
                content: `""`,
                position: `absolute`,
                left: 0,
                bottom: 0,
                height: 0,
                width: `4px`,
                transition: `1s`,
                bgcolor: `#fca311`,
              },
              "&:after": {
                content: `""`,
                position: `absolute`,
                right: 0,
                top: 0,
                height: 0,
                width: `4px`,
                transition: `0.3s`,
                bgcolor: `#fca311`,
              },
              "&:hover": {
                "&:before": {
                  height: `100%`,
                },
                "&:after": {
                  height: `100%`,
                },
              },
            }}
            bgcolor="secondary.main"
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
            sx={{
              overflow: `hidden`,
              borderRadius: "6px",
              position: `relative`,
              "&:before": {
                content: `""`,
                position: `absolute`,
                left: 0,
                bottom: 0,
                height: 0,
                width: `4px`,
                transition: `1s`,
                bgcolor: `#fca311`,
              },
              "&:after": {
                content: `""`,
                position: `absolute`,
                right: 0,
                top: 0,
                height: 0,
                width: `4px`,
                transition: `0.3s`,
                bgcolor: `#fca311`,
              },
              "&:hover": {
                "&:before": {
                  height: `100%`,
                },
                "&:after": {
                  height: `100%`,
                },
              },
            }}
            bgcolor="secondary.main"
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
            sx={{
              overflow: `hidden`,
              borderRadius: "6px",
              position: `relative`,
              "&:before": {
                content: `""`,
                position: `absolute`,
                left: 0,
                bottom: 0,
                height: 0,
                width: `4px`,
                transition: `1s`,
                bgcolor: `#fca311`,
              },
              "&:after": {
                content: `""`,
                position: `absolute`,
                right: 0,
                top: 0,
                height: 0,
                width: `4px`,
                transition: `0.3s`,
                bgcolor: `#fca311`,
              },
              "&:hover": {
                "&:before": {
                  height: `100%`,
                },
                "&:after": {
                  height: `100%`,
                },
              },
            }}
            bgcolor="secondary.main"
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
            sx={{
              overflow: `hidden`,
              borderRadius: "6px",
              position: `relative`,
              "&:before": {
                content: `""`,
                position: `absolute`,
                left: 0,
                bottom: 0,
                height: 0,
                width: `4px`,
                transition: `1s`,
                bgcolor: `#fca311`,
              },
              "&:after": {
                content: `""`,
                position: `absolute`,
                right: 0,
                top: 0,
                height: 0,
                width: `4px`,
                transition: `0.3s`,
                bgcolor: `#fca311`,
              },
              "&:hover": {
                "&:before": {
                  height: `100%`,
                },
                "&:after": {
                  height: `100%`,
                },
              },
            }}
            bgcolor="secondary.main"
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
            sx={{
              overflow: `hidden`,
              borderRadius: "6px",
              position: `relative`,
              "&:before": {
                content: `""`,
                position: `absolute`,
                left: 0,
                bottom: 0,
                height: 0,
                width: `4px`,
                transition: `1s`,
                bgcolor: `#fca311`,
              },
              "&:after": {
                content: `""`,
                position: `absolute`,
                right: 0,
                top: 0,
                height: 0,
                width: `4px`,
                transition: `0.3s`,
                bgcolor: `#fca311`,
              },
              "&:hover": {
                "&:before": {
                  height: `100%`,
                },
                "&:after": {
                  height: `100%`,
                },
              },
            }}
            bgcolor="secondary.main"
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
            sx={{
              overflow: `hidden`,
              borderRadius: "6px",
              position: `relative`,
              "&:before": {
                content: `""`,
                position: `absolute`,
                left: 0,
                bottom: 0,
                height: 0,
                width: `4px`,
                transition: `1s`,
                bgcolor: `#fca311`,
              },
              "&:after": {
                content: `""`,
                position: `absolute`,
                right: 0,
                top: 0,
                height: 0,
                width: `4px`,
                transition: `0.3s`,
                bgcolor: `#fca311`,
              },
              "&:hover": {
                "&:before": {
                  height: `100%`,
                },
                "&:after": {
                  height: `100%`,
                },
              },
            }}
            bgcolor="secondary.main"
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
            sx={{
              overflow: `hidden`,
              borderRadius: "6px",
              position: `relative`,
              "&:before": {
                content: `""`,
                position: `absolute`,
                left: 0,
                bottom: 0,
                height: 0,
                width: `4px`,
                transition: `1s`,
                bgcolor: `#fca311`,
              },
              "&:after": {
                content: `""`,
                position: `absolute`,
                right: 0,
                top: 0,
                height: 0,
                width: `4px`,
                transition: `0.3s`,
                bgcolor: `#fca311`,
              },
              "&:hover": {
                "&:before": {
                  height: `100%`,
                },
                "&:after": {
                  height: `100%`,
                },
              },
            }}
            bgcolor="secondary.main"
          >
            <Box>Economy</Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AcademicSupport;
