import "./footer.css";
import { Box, Stack, IconButton } from "@mui/material";

const Footer = () => {
  const getCurrentYear = () => {
    const date = new Date();
    return date.getFullYear();
  };
  return (
    <Box className="footer section" pt={4} bgcolor="gray.main">
      <Stack
        className="container"
        direction={{ md: "row" }}
        justifyContent="space-between"
        spacing={4}
        pb={4}
      >
        <Stack
          alignItems={{
            xs: "center",
            md: "start",
          }}
          flex={1}
        >
          <Box mb={3} fontSize="20px">
            <span
              style={{
                minWidth: "200px",
                fontWeight: "bold",
                display: "inline-block",
              }}
            >
              Email:
            </span>
            <span> marrifa-aaa@gmail.com</span>
          </Box>
          <Stack mb={3} fontSize="20px" direction="row">
            <span
              style={{
                minWidth: "200px",
                fontWeight: "bold",
                display: "inline-block",
              }}
            >
              Phone Numbers:
            </span>
            <ul
              className="phone-numbers"
              style={{ display: "inline-block", marginLeft: "20px" }}
            >
              <li>(+961) 81-329-073</li>
              <li>(+961) 81-290-191</li>
              <li>(+961) 70-439-510</li>
            </ul>
          </Stack>
        </Stack>
        <Box
          className="logo"
          sx={{
            margin: "15px auto",
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "secondary.main",
          }}
        >
          <IconButton
            className="logo-button"
            sx={{
              width: "100%",
              height: "100%",
              fontWeight: "700",
              color: "primary.main",
            }}
          >
            Ma'rifah
          </IconButton>
        </Box>
      </Stack>
      <Box
        className="rights"
        textAlign="center"
        pt={3}
        pb={3}
        fontSize="22px"
        color="white"
        fontWeight="bold"
        bgcolor="secondary.main"
      >
        @{getCurrentYear()} , <span>Ma'arifah</span> all rights reserved
      </Box>
    </Box>
  );
};

export default Footer;
