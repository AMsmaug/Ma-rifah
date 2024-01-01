import { Box, Stack } from "@mui/material";

import { ActiveContext } from "../components/Auth/UserInfo";
import { useContext } from "react";

const ProfilePage = () => {
  const { userName, profileUrl } = useContext(ActiveContext);

  console.log(userName);

  return (
    <Stack
      sx={{
        justifyContent: "center",
        alignItems: "center",
      }}
      gap={5}
      direction="row"
      className="profile-page container"
    >
      <Box
        sx={{
          width: "100%",
          height: "200px",
          position: "fixed",
          backgroundColor: "var(--dark-blue)",
          top: "0",
          left: "0",
          textAlign: "center",
          color: "var(--orange)",
          pt: "30px",
          fontSize: "40px",
          letterSpacing: "7px",
        }}
      >
        MA-RIFAH
      </Box>
      <Stack zIndex={300} mt="110px">
        <Box>
          <Box
            sx={{
              width: "170px",
              height: "170px",
              borderRadius: "50%",
              overflow: "hidden",
              textAlign: "center",
              margin: "0 auto",
              border: "3px solid white",
            }}
          >
            {/* <img src="../../public/images/av3.png" alt="" width="100%" /> */}
            <img style={{ width: "100%" }} src={profileUrl} alt="" />
          </Box>
        </Box>
        <Box mt={4}>
          <Stack direction="row" alignItems="center" gap={3} mb={4}>
            <Box fontWeight="bold" fontSize={22} minWidth={120}>
              Name:
            </Box>
            <Box fontSize={22}>Abdallah al korhani</Box>
          </Stack>
          <Stack direction="row" alignItems="center" gap={3} mb={4}>
            <Box fontWeight="bold" fontSize={22} minWidth={120}>
              Email:
            </Box>
            <Box fontSize={22}>abdallahkorhani1@gmail.com</Box>
          </Stack>
          <Stack direction="row" alignItems="center" gap={3} mb={4}>
            <Box fontWeight="bold" fontSize={22} minWidth={120}>
              Grade:
            </Box>
            <Box fontSize={22}>Grade 12 - SG</Box>
          </Stack>
        </Box>
      </Stack>
    </Stack>
  );
};

export default ProfilePage;
