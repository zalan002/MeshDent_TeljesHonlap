"use client";

import { useState } from "react";

type Props = {
  className?: string;
  variant?: "color" | "white";
  /**
   * A hivatalos logó képének útvonala. Alapértelmezetten
   * `/images/meshdent-logo.png` — ha ez a fájl létezik a public/-ban,
   * a komponens automatikusan azt jeleníti meg. Ha hiányzik (404),
   * automatikusan visszaesik a beépített SVG fallback wordmarkra.
   *
   * Nullára / üresre állítva kifejezetten az SVG fallbacket kéri.
   */
  image?: string | null;
  imageWidth?: number;
  imageHeight?: number;
  alt?: string;
};

export default function Logo({
  className,
  variant = "color",
  image = "/images/meshdent-logo.png",
  imageWidth = 200,
  imageHeight = 56,
  alt = "Meshdent — Digitális fogtechnika Budapest",
}: Props) {
  const [imgFailed, setImgFailed] = useState(false);

  const showImage = !!image && !imgFailed;

  if (showImage) {
    return (
      <span
        className={className}
        style={{ display: "inline-flex", alignItems: "center" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image as string}
          alt={alt}
          width={imageWidth}
          height={imageHeight}
          onError={() => setImgFailed(true)}
          style={{
            height: "auto",
            width: "auto",
            maxHeight: imageHeight,
            display: "block",
          }}
        />
      </span>
    );
  }

  // SVG fallback — Bebas Neue wordmark + magyar zászló-utalás
  const wordmark = variant === "white" ? "#ffffff" : "#1aa37e";
  const accent = variant === "white" ? "#ffffff" : "#d6313a";
  const tagline = variant === "white" ? "rgba(255,255,255,0.9)" : "#1a1a1a";

  return (
    <span
      className={className}
      aria-label={alt}
      role="img"
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 2,
        fontFamily: "var(--font-display)",
        lineHeight: 1,
      }}
    >
      <svg
        viewBox="0 0 240 52"
        width="200"
        height="44"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        style={{ display: "block" }}
      >
        <text
          x="0"
          y="40"
          style={{ fontFamily: "var(--font-bebas), 'Bebas Neue', Impact, sans-serif" }}
          fontSize="50"
          fontWeight="400"
          fill={wordmark}
          letterSpacing="1"
        >
          MESHDENT
        </text>
        {/* Piros zászló-sávok az E betűk pozícióján.
            Bebas Neue-vel a betű-szélességek eléggé prediktálhatók,
            a sávok pozíciója közel áll a hivatalos logóhoz. */}
        <rect x="29" y="13" width="20" height="5" fill={accent} />
        <rect x="29" y="24" width="20" height="5" fill={accent} />
        <rect x="125" y="13" width="20" height="5" fill={accent} />
        <rect x="125" y="24" width="20" height="5" fill={accent} />
      </svg>
      <span
        style={{
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: "0.16em",
          color: tagline,
          textTransform: "uppercase",
          marginTop: 2,
        }}
      >
        Digitális fogtechnika Budapest
      </span>
    </span>
  );
}
