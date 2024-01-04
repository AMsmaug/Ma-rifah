import { useNavigate } from "react-router-dom";
import "./footer.css";
import { Box, Stack, IconButton, Typography } from "@mui/material";

const Footer = () => {
  const navigate = useNavigate();
  const getCurrentYear = () => {
    const date = new Date();
    return date.getFullYear();
  };
  return (
    <Box className="footer section" pt={4} bgcolor="gray.main">
      <Stack className="container" direction={`row`} spacing={4} pb={4}>
        <Stack
          // alignItems={{
          //   sm: `center`,
          //   md: "start",
          //   lg: `start`,
          // }}
          justifyContent={`space-between`}
          flex={1}
          padding={`0 15px`}
        >
          <Stack
            mb={3}
            fontSize="20px"
            direction={`row`}
            gap={{ xs: 2, sm: 8, md: 10 }}
          >
            <Typography
              sx={{
                minWidth: "200px",
                fontWeight: "bold",
                display: "inline-block",
                fontSize: {
                  xs: `16px`,
                  sm: `18px`,
                  md: `24px`,
                  lg: `24px`,
                },
              }}
            >
              Email:
            </Typography>
            <Typography
              fontSize={{ xs: `16px`, sm: `18px`, md: `22px`, lg: `22px` }}
            >
              marrifa-aaa@gmail.com
            </Typography>
          </Stack>
          <Stack
            fontSize="20px"
            direction={`row`}
            gap={{ xs: 2, sm: 8, md: 10 }}
          >
            <Typography
              sx={{
                minWidth: "200px",
                fontWeight: "bold",
                display: "inline-block",
                fontSize: {
                  xs: `16px`,
                  sm: `18px`,
                  md: `24px`,
                  lg: `24px`,
                },
              }}
            >
              Phone Numbers:
            </Typography>
            <ul
              className="phone-numbers"
              style={{ display: "inline-block", marginLeft: "20px" }}
            >
              <li>
                <Typography
                  fontSize={{ xs: `16px`, sm: `18px`, md: `20px`, lg: `22px` }}
                >
                  (+961) 81-328-073
                </Typography>
              </li>
              <li>
                <Typography
                  fontSize={{ xs: `16px`, sm: `18px`, md: `20px`, lg: `22px` }}
                >
                  (+961) 81-290-191
                </Typography>
              </li>
              <li>
                <Typography
                  fontSize={{ xs: `16px`, sm: `18px`, md: `20px`, lg: `22px` }}
                >
                  (+961) 70-439-510
                </Typography>
              </li>
            </ul>
          </Stack>
        </Stack>
        <Box
          className="logo"
          sx={{
            display: {
              xs: `none`,
              sm: `none`,
              md: `flex`,
              lg: `flex`,
            },
            margin: "15px auto",
            width: "150px",
            height: "150px",
            borderRadius: "50%",
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
            onClick={() => {
              navigate("/");
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
        fontSize={{ xs: `20px`, sm: `20px`, md: "22px", lg: "22px" }}
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
