import React from "react";
import { Button, ButtonGroup } from "@mui/material";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";

import { PRIMARY_COLOR } from "../../src/theme";

const activeStyle = {
  border: `1px solid ${PRIMARY_COLOR}`,
  borderRightColor: `${PRIMARY_COLOR} !important`, // overrides MUI default style
};

const LanguageSelector: React.FunctionComponent = (props) => {
  const { t } = useTranslation(["common", "success"]);
  const { locale } = useRouter();

  return (
    <ButtonGroup aria-label="Language" size="small" sx={{ marginY: "1rem" }}>
      <Link href="" locale="en">
        <Button sx={locale === "en" ? activeStyle : null}>English</Button>
      </Link>
      <Link href="" locale="zh">
        <Button sx={locale === "zh" ? activeStyle : null}>中文</Button>
      </Link>
    </ButtonGroup>
  );
};

export default LanguageSelector;
