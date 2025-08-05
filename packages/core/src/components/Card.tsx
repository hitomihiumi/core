"use client";

import React, { forwardRef } from "react";
import { Flex } from ".";
import styles from "./Card.module.scss";
import { ElementType } from "./ElementType";
import classNames from "classnames";

interface CardProps extends React.ComponentProps<typeof Flex> {
  children?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  fillHeight?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, href, onClick, style, className, fillHeight, ...rest }, ref) => {
    return (
      <ElementType
        tabIndex={onClick || href ? 0 : undefined}
        className={classNames(
          "reset-button-styles",
          "display-flex",
          "fill-width",
          fillHeight ? "fill-height" : undefined,
          "min-width-0",
          (onClick || href) && "focus-ring",
          (onClick || href) && "radius-l",
        )}
        href={href}
        onClick={onClick && onClick}
        role={onClick ? "button" : href ? "link" : "none"}
        ref={ref}
      >
        <Flex
          background="surface"
          onBackground="neutral-strong"
          transition="macro-medium"
          border="neutral-medium"
          cursor="interactive"
          align="left"
          className={classNames(styles.card, className)}
          onClick={onClick && onClick}
          style={{
            ...style,
          }}
          {...rest}
        >
          {children}
        </Flex>
      </ElementType>
    );
  },
);

Card.displayName = "Card";
export { Card };
