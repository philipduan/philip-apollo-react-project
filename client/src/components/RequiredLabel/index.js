import { Box, Text } from "grommet";
import React from "react";

const RequiredLabel = ({ children }) => {
  return (
    <Box direction="row">
      <Text margin={{ right: "xsmall" }}>{children}</Text>
      <Text color="status-critical">*</Text>
    </Box>
  );
};

export default RequiredLabel;
