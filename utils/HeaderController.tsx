import React from "react";
import Header from "next/head";
import { NextPage } from "next";
export interface HeaderControllerProps {
  title?: string;
  embed?: { hexColor?: string; image?: string };
  owner?: string;
  additionalKeywords?: string[];
  description?: string;
}

export const HeaderController: NextPage<HeaderControllerProps> = ({
  title,
  description = "Open Library Let's Observe",
  owner,
  additionalKeywords = [],
  embed,
}) => {
  return (
    <Header>
      {title ? <title>{title} | ollo</title> : <title>ollo</title>}
      <meta name="description" content={description} />
      {owner ? <meta name="author" content={owner} /> : ""}
      <meta
        name="keywords"
        content={`ollo, ${additionalKeywords?.map((k) => `, ${k}`)}`}
      />
      <meta name="theme-color" content={embed?.hexColor || "#FFFFFF"} />
      {embed ? (
        <>
          <meta name="og:title" content={title || "Libby"} />
          <meta
            name="og:type"
            content={owner ? "music.radio_station" : "website"}
          />
          {owner ? <meta name="music:creator" content={owner} /> : ""}
          <meta name="og:description" content={description} />
          <meta name="og:site_name" content="ollo" />
        </>
      ) : (
        ""
      )}
    </Header>
  );
};
