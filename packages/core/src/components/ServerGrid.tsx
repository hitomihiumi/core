import { CSSProperties, forwardRef } from "react";
import classNames from "classnames";

import {
  GridProps,
  SpacingProps,
  SizeProps,
  StyleProps,
  CommonProps,
  DisplayProps,
} from "../interfaces";
import { SpacingToken, ColorScheme, ColorWeight } from "../types";

interface ComponentProps
  extends GridProps,
    SpacingProps,
    SizeProps,
    StyleProps,
    CommonProps,
    DisplayProps {
      xl?: any;
      l?: any;
      m?: any;
      s?: any;
      xs?: any;
    }

const ServerGrid = forwardRef<HTMLDivElement, ComponentProps>(
  (
    {
      as: Component = "div",
      inline,
      columns,
      gap,
      position = "relative",
      xl,
      l,
      m,
      s,
      xs,
      hide,
      aspectRatio,
      align,
      textVariant,
      textSize,
      textWeight,
      textType,
      padding,
      paddingLeft,
      paddingRight,
      paddingTop,
      paddingBottom,
      paddingX,
      paddingY,
      margin,
      marginLeft,
      marginRight,
      marginTop,
      marginBottom,
      marginX,
      marginY,
      dark,
      light,
      width,
      height,
      maxWidth,
      minWidth,
      minHeight,
      maxHeight,
      top,
      right,
      bottom,
      left,
      fit,
      fill,
      fillWidth = false,
      fillHeight = false,
      fitWidth,
      fitHeight,
      background,
      solid,
      opacity,
      transition,
      pointerEvents,
      border,
      borderTop,
      borderRight,
      borderBottom,
      borderLeft,
      borderX,
      borderY,
      borderStyle,
      borderWidth,
      radius,
      topRadius,
      rightRadius,
      bottomRadius,
      leftRadius,
      topLeftRadius,
      topRightRadius,
      bottomLeftRadius,
      bottomRightRadius,
      overflow,
      overflowX,
      overflowY,
      cursor,
      zIndex,
      shadow,
      className,
      style,
      children,
      ...rest
    },
    ref,
  ) => {

    const generateDynamicClass = (type: string, value: string | "-1" | undefined) => {
      if (!value) return undefined;

      if (value === "transparent") {
        return `transparent-border`;
      }

      if (value === "surface" || value === "page" || value === "transparent") {
        return `${value}-${type}`;
      }

      const parts = value.split("-");
      if (parts.includes("alpha")) {
        const [scheme, , weight] = parts;
        return `${scheme}-${type}-alpha-${weight}`;
      }

      const [scheme, weight] = value.split("-") as [ColorScheme, ColorWeight];
      return `${scheme}-${type}-${weight}`;
    };

    const parseDimension = (
      value: number | SpacingToken | undefined,
      type: "width" | "height",
    ): string | undefined => {
      if (value === undefined) return undefined;
      if (typeof value === "number") return `${value}rem`;
      if (
        [
          "0",
          "1",
          "2",
          "4",
          "8",
          "12",
          "16",
          "20",
          "24",
          "32",
          "40",
          "48",
          "56",
          "64",
          "80",
          "104",
          "128",
          "160",
        ].includes(value)
      ) {
        return `var(--static-space-${value})`;
      }
      if (["xs", "s", "m", "l", "xl"].includes(value)) {
        return `var(--responsive-${type}-${value})`;
      }
      return undefined;
    };

    const classes = classNames(
      position && `position-${position}`,
      l?.position && `l-position-${l.position}`,
      m?.position && `m-position-${m.position}`,
      s?.position && `s-position-${s.position}`,
      inline ? "display-inline-grid" : "display-grid",
      hide && "grid-hide",
      l?.hide && "l-grid-hide",
      m?.hide && "m-grid-hide",
      s?.hide && "s-grid-hide",
      fit && "fit",
      fitWidth && "fit-width",
      fitHeight && "fit-height",
      fill && "fill",
      (fillWidth || maxWidth) && "fill-width",
      (fillHeight || maxHeight) && "fill-height",
      columns && `columns-${columns}`,
      l?.columns && `l-columns-${l.columns}`,
      m?.columns && `m-columns-${m.columns}`,
      s?.columns && `s-columns-${s.columns}`,
      overflow && `overflow-${overflow}`,
      overflowX && `overflow-x-${overflowX}`,
      overflowY && `overflow-y-${overflowY}`,
      l?.overflow && `l-overflow-${l.overflow}`,
      m?.overflow && `m-overflow-${m.overflow}`,
      s?.overflow && `s-overflow-${s.overflow}`,
      l?.overflowX && `l-overflow-x-${l.overflowX}`,
      m?.overflowX && `m-overflow-x-${m.overflowX}`,
      s?.overflowX && `s-overflow-x-${s.overflowX}`,
      l?.overflowY && `l-overflow-y-${l.overflowY}`,
      m?.overflowY && `m-overflow-y-${m.overflowY}`,
      s?.overflowY && `s-overflow-y-${s.overflowY}`,
      padding && `p-${padding}`,
      paddingLeft && `pl-${paddingLeft}`,
      paddingRight && `pr-${paddingRight}`,
      paddingTop && `pt-${paddingTop}`,
      paddingBottom && `pb-${paddingBottom}`,
      paddingX && `px-${paddingX}`,
      paddingY && `py-${paddingY}`,
      margin && `m-${margin}`,
      marginLeft && `ml-${marginLeft}`,
      marginRight && `mr-${marginRight}`,
      marginTop && `mt-${marginTop}`,
      marginBottom && `mb-${marginBottom}`,
      marginX && `mx-${marginX}`,
      marginY && `my-${marginY}`,
      gap && `g-${gap}`,
      top && `top-${top}`,
      l?.top && `l-top-${l.top}`,
      m?.top && `m-top-${m.top}`,
      s?.top && `s-top-${s.top}`,
      right && `right-${right}`,
      l?.right && `l-right-${l.right}`,
      m?.right && `m-right-${m.right}`,
      s?.right && `s-right-${s.right}`,
      bottom && `bottom-${bottom}`,
      l?.bottom && `l-bottom-${l.bottom}`,
      m?.bottom && `m-bottom-${m.bottom}`,
      s?.bottom && `s-bottom-${s.bottom}`,
      left && `left-${left}`,
      l?.left && `l-left-${l.left}`,
      m?.left && `m-left-${m.left}`,
      s?.left && `s-left-${s.left}`,
      generateDynamicClass("background", background),
      generateDynamicClass("solid", solid),
      generateDynamicClass(
        "border",
        border || borderTop || borderRight || borderBottom || borderLeft || borderX || borderY,
      ),
      (border || borderTop || borderRight || borderBottom || borderLeft || borderX || borderY) &&
        !borderStyle &&
        "border-solid",
      border && !borderWidth && `border-1`,
      (borderTop || borderRight || borderBottom || borderLeft || borderX || borderY) && "border-reset",
      borderTop && "border-top-1",
      borderRight && "border-right-1",
      borderBottom && "border-bottom-1",
      borderLeft && "border-left-1",
      borderX && "border-x-1",
      borderY && "border-y-1",
      borderWidth && `border-${borderWidth}`,
      borderStyle && `border-${borderStyle}`,
      radius === "full" ? "radius-full" : radius && `radius-${radius}`,
      topRadius && `radius-${topRadius}-top`,
      rightRadius && `radius-${rightRadius}-right`,
      bottomRadius && `radius-${bottomRadius}-bottom`,
      leftRadius && `radius-${leftRadius}-left`,
      topLeftRadius && `radius-${topLeftRadius}-top-left`,
      topRightRadius && `radius-${topRightRadius}-top-right`,
      bottomLeftRadius && `radius-${bottomLeftRadius}-bottom-left`,
      bottomRightRadius && `radius-${bottomRightRadius}-bottom-right`,
      pointerEvents && `pointer-events-${pointerEvents}`,
      transition && `transition-${transition}`,
      shadow && `shadow-${shadow}`,
      zIndex && `z-index-${zIndex}`,
      textType && `font-${textType}`,
      typeof cursor === 'string' && `cursor-${cursor}`,
      dark && "dark-grid",
      light && "light-grid",
      className,
    );

    const combinedStyle: CSSProperties = {
      maxWidth: parseDimension(maxWidth, "width"),
      minWidth: parseDimension(minWidth, "width"),
      minHeight: parseDimension(minHeight, "height"),
      maxHeight: parseDimension(maxHeight, "height"),
      width: parseDimension(width, "width"),
      height: parseDimension(height, "height"),
      aspectRatio: aspectRatio,
      textAlign: align,
      // Hide default cursor when using custom cursor
      cursor: typeof cursor === 'string' ? cursor : undefined,
      ...style,
    };

    return (
      <Component ref={ref} className={classes} style={combinedStyle} {...rest}>
        {children}
      </Component>
    );
  },
);

ServerGrid.displayName = "ServerGrid";

export { ServerGrid };
export type { GridProps };
