import React from "react";
import { Image } from "@chakra-ui/react";
// import { ImageWrapper } from "~~/components";
import styled from "styled-components";

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-top: 100%; // 16:9 aspect ratio is 56.25%

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

interface CardProps {
  className?: string;
  align?: string;
  imageUrl?: string;
  children: React.ReactNode;
  title?: string;
  footer?: React.ReactNode;
}

const StyledCard = styled.div`
  .card-body {
    gap: 0;
  }
`;

const Card: React.FC<CardProps & { compact?: boolean }> = ({
  className,
  children,
  title,
  footer,
  align = "left",
  imageUrl,
  compact = false,
}) => {
  return (
    <StyledCard className={`${className + " card bg-neutral text-neutral-content rounded-lg overflow-hidden w-[300px]"}`}>
      {imageUrl && (
        <ImageWrapper>
          <Image src={imageUrl} alt={"Exam Image"} />
        </ImageWrapper>
      )}
      <div className={`card-body ${compact && "p-5 pb-2"} items-${align} flex flex-col justify-between`}>
        <div>
          {title && <h1 className={`card-title ${compact && "font-bold"}`}>{title}</h1>}
          {children}
        </div>
        <div className="flex flex-col justify-between">
          {footer && (
            <div className={`card-actions justify-end ${compact && "mt-4"}`}>
              {!compact && <div className="divider w-full"></div>}
              {footer}
            </div>
          )}
        </div>
      </div>
    </StyledCard>
  );
};

export default Card;