import "./contactUs.css";
import { Box, Stack, TextField, InputAdornment, Button } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import CommentIcon from "@mui/icons-material/Comment";

const ContactUs = () => {
  return (
    <Box
      className="contact-us section"
      id="Contact-us"
      pt={4}
      pb={4}
      pr={1}
      pl={1}
    >
      <Box className="container">
        <h2 className="main-title">Contact Us</h2>
        <Stack
          direction={{
            md: "row",
          }}
          mt={12}
          gap={8}
          justifyContent="center"
          pb={7}
        >
          <Box
            maxWidth="400px"
            overflow="hidden"
            alignSelf={{
              xs: "center",
              lg: "start",
            }}
          >
            <img
              height="300px"
              src="../../../../public/images/contactusImg.jpg"
            />
          </Box>
          <Box
            flexBasis={{
              md: "40%",
            }}
          >
            <Stack spacing={6} mb={4}>
              <TextField
                label="Name"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ marginBottom: "10px" }}
              />
              <TextField
                label="Email"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ marginBottom: "10px" }}
              />
              <TextField
                multiline
                rows={4}
                label={<CustomLabel />}
                sx={{ marginBottom: "10px" }}
              />
            </Stack>

            <Button
              sx={{ display: "block", margin: "0 auto", color: "white" }}
              variant="contained"
              size="large"
              color="secondary"
            >
              Submit
            </Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

const CustomLabel = () => {
  return (
    <span style={{ display: "flex", alignItems: "center" }}>
      <CommentIcon /> <span style={{ marginLeft: "8px" }}>Comment</span>
    </span>
  );
};

export default ContactUs;
