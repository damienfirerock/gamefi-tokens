import React from "react";
import { Button, ButtonGroup } from "@mui/material";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";

import { PRIMARY_COLOR } from "../../src/theme";

const LanguageSelector: React.FunctionComponent = (props) => {
  const { t } = useTranslation(["common", "success"]);
  const { locale } = useRouter();

  return (
    <ButtonGroup aria-label="Language" size="small" sx={{ marginY: "1rem" }}>
      <Link href="" locale="en">
        <Button sx={{ borderColor: locale === "en" ? PRIMARY_COLOR : null }}>
          English
        </Button>
      </Link>
      <Link href="" locale="zh">
        <Button sx={{ borderColor: locale === "zh" ? PRIMARY_COLOR : null }}>
          中文
        </Button>
      </Link>
    </ButtonGroup>
  );
};

export default LanguageSelector;
