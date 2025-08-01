"use client";

import React, { CSSProperties, useState, useRef, useEffect, ReactNode } from "react";
import Image from "next/image";

import { Column, Flex, Row, Skeleton } from ".";

export interface MediaProps extends React.ComponentProps<typeof Flex> {
  aspectRatio?: string;
  height?: number;
  alt?: string;
  loading?: boolean;
  objectFit?: CSSProperties["objectFit"];
  enlarge?: boolean;
  src: string;
  unoptimized?: boolean;
  sizes?: string;
  priority?: boolean;
  caption?: ReactNode;
  fillWidth?: boolean;
  style?: CSSProperties;
  className?: string;
}

const Media: React.FC<MediaProps> = ({
  aspectRatio,
  height,
  alt = "",
  loading = false,
  objectFit = "cover",
  enlarge = false,
  src,
  unoptimized = false,
  priority,
  sizes = "100vw",
  caption,
  fillWidth = true,
  style,
  className,
  ...rest
}) => {
  const [isEnlarged, setIsEnlarged] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (enlarge) {
      setIsEnlarged(!isEnlarged);
    }
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isEnlarged) {
        setIsEnlarged(false);
      }
    };

    const handleWheel = (event: WheelEvent) => {
      if (isEnlarged) {
        setIsEnlarged(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    window.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [isEnlarged]);

  useEffect(() => {
    if (isEnlarged) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isEnlarged]);

  const calculateTransform = () => {
    if (!imageRef.current) return {};

    const rect = imageRef.current.getBoundingClientRect();
    const scaleX = window.innerWidth / rect.width;
    const scaleY = window.innerHeight / rect.height;
    const scale = Math.min(scaleX, scaleY) * 0.9;

    const translateX = (window.innerWidth - rect.width) / 2 - rect.left;
    const translateY = (window.innerHeight - rect.height) / 2 - rect.top;

    return {
      transform: isEnlarged
        ? `translate(${translateX}px, ${translateY}px) scale(${scale})`
        : "translate(0, 0) scale(1)",
      transition: "all 0.3s ease-in-out",
      zIndex: isEnlarged ? 10 : undefined,
    };
  };

  const isYouTubeVideo = (url: string) => {
    const youtubeRegex =
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    return youtubeRegex.test(url);
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    );
    return match
      ? `https://www.youtube.com/embed/${match[1]}?controls=0&rel=0&modestbranding=1`
      : "";
  };

  const isVideo = src?.endsWith(".mp4");
  const isYouTube = isYouTubeVideo(src);

  return (
    <>
      <>
        <Column
          as={caption ? "figure" : undefined}
          ref={imageRef}
          fillWidth
          overflow="hidden"
          zIndex={0}
          margin="0"
          cursor={enlarge ? "interactive" : undefined}
          style={{
            outline: "none",
            isolation: "isolate",
            height: aspectRatio ? "" : height ? `${height}rem` : "100%",
            aspectRatio,
            borderRadius: isEnlarged ? "0" : undefined,
            ...calculateTransform(),
            ...style,
          }}
          onClick={handleClick}
          className={className}
          {...rest}
        >
          {loading && <Skeleton shape="block" />}
          {!loading && isVideo && (
            <video
              src={src}
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: objectFit,
              }}
            />
          )}
          {!loading && isYouTube && (
            <iframe
              width="100%"
              height="100%"
              src={getYouTubeEmbedUrl(src)}
              frameBorder="0"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                objectFit: objectFit,
              }}
            />
          )}
          {!loading && !isVideo && !isYouTube && (
            <Image
              src={src}
              alt={alt}
              priority={priority}
              sizes={sizes}
              unoptimized={unoptimized}
              fill
              style={{
                objectFit: objectFit,
              }}
            />
          )}
        </Column>
        {caption && (
          <Row as="figcaption" fillWidth textVariant="label-default-s" onBackground="neutral-weak" paddingY="12" paddingX="24" horizontal="center" align="center">
            {caption}
          </Row>
        )}
      </>

      {isEnlarged && enlarge && (
        <Flex
          horizontal="center"
          vertical="center"
          position="fixed"
          background="overlay"
          pointerEvents="none"
          onClick={handleClick}
          top="0"
          left="0"
          zIndex={isEnlarged ? 9 : undefined}
          opacity={isEnlarged ? 100 : 0}
          cursor="interactive"
          transition="macro-medium"
          style={{
            backdropFilter: isEnlarged ? "var(--backdrop-filter)" : "0px",
            width: "100vw",
            height: "100vh",
          }}
        >
          <Flex
            style={{
              height: "100vh",
              transform: "translate(-50%, -50%)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {isVideo ? (
              <video
                src={src}
                autoPlay
                loop
                muted
                playsInline
                style={{
                  width: "90vw",
                  height: "auto",
                  objectFit: "contain",
                }}
              />
            ) : (
              <Image
                src={src}
                alt={alt}
                fill
                sizes="90vw"
                unoptimized={unoptimized}
                style={{
                  objectFit: "contain",
                }}
              />
            )}
          </Flex>
        </Flex>
      )}
    </>
  );
};

Media.displayName = "Media";
export { Media };
