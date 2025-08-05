"use client";

import React, { useCallback } from "react";
import { Heading, Flex, IconButton } from "../../components";
import { useToast } from "../../contexts";
import styles from "./HeadingLink.module.scss";

interface HeadingLinkProps extends React.ComponentProps<typeof Flex> {
  id: string;
  as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const variantMap = {
  h1: "display-strong-xs",
  h2: "heading-strong-xl",
  h3: "heading-strong-l",
  h4: "heading-strong-m",
  h5: "heading-strong-s",
  h6: "heading-strong-xs",
} as const;

export const HeadingLink: React.FC<HeadingLinkProps> = ({
  id,
  as,
  children,
  style,
  ...flex
}) => {
  const { addToast } = useToast();

  const copyURL = useCallback((id: string) => {
    try {
      const url = `${window.location.origin}${window.location.pathname}#${id}`;
      navigator.clipboard.writeText(url).then(
        () => {
          addToast?.({
            variant: "success",
            message: "Link copied to clipboard.",
          });
        },
        () => {
          addToast?.({
            variant: "danger",
            message: "Failed to copy link.",
          });
        },
      );
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  }, [addToast]);

  const variant = variantMap[as];

  return (
    <Flex
      style={style}
      onClick={() => copyURL(id)}
      className={styles.control}
      vertical="center"
      gap="8"
      {...flex}
    >
      <Heading className={styles.text} id={id} variant={variant} as={as}>
        {children}
      </Heading>
      <IconButton
        className={styles.visibility}
        size="m"
        icon="link"
        variant="secondary"
        tooltip="Copy"
        tooltipPosition="right"
      />
    </Flex>
  );
};
