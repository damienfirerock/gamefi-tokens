import React from "react";
import { useTheme } from "@mui/material";

interface SectionProps {
  children: React.ReactNode;
}

const Section: React.FunctionComponent<SectionProps> = ({ children }) => {
  const theme = useTheme();
  return (
    <section
      style={{
        color: "#282c35",
        borderRadius: 10,
        padding: 10,
        marginBottom: `${theme.spacing(1.5)}`,
      }}
    >
      {children}
    </section>
  );
};

export default Section;
