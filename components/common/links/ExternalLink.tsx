import React from "react";

type ExternalLinkProps = {
  url: string;
  label: string;
};

const ExternalLink: React.FunctionComponent<ExternalLinkProps> = ({
  url,
  label,
}) => {
  return (
    <a href={url} target="_blank" rel="noreferrer">
      {label}
    </a>
  );
};

export default ExternalLink;
