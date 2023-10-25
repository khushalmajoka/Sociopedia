import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import Form from "./Form";
import { useEffect, useState } from "react";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  useEffect(() => {
    console.log({loading})
  },[loading])
  return (
    <Box>
      <Box
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        textAlign="center"
        position="sticky"
        top="0"
        zIndex="2"
      >
        <Typography fontWeight="bold" fontSize="32px" color="primary">
          Sociopedia
        </Typography>
      </Box>
      <Box sx={{ width: "100%" }}>
        {loading && <LinearProgress />}
      </Box>
      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
        <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
          Welcome to Socipedia, the Social Media for Sociopaths!
        </Typography>
        <Form setLoading={setLoading} />
      </Box>
    </Box>
  );
};

export default LoginPage;
