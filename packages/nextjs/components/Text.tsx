/* eslint-disable prettier/prettier */
import React, { FC } from 'react';
import styled from 'styled-components';
import { Text, TextProps } from '@chakra-ui/react'

interface Props extends TextProps {
  className?: string;
  children: any;
  id?: string;
  $highlight?: string;
  tiny?: boolean;
  ellipsis?: boolean;
  large?: boolean;
  xs?: boolean;
  bold?: boolean;
  block?: boolean;
  color?: string;
  htmlFor?: string;
}

export const StyledSpan = styled.span<Props>`
  position: relative;
  ${({ $highlight }) =>
    `&:after {
        content: '';
        width: calc(100% - 3px);
        height: 40%;
        top: 60%;
        left: 5px;
        right: 0px;
        position: absolute;
        opacity: 0.3;
        background-color: var(--chakra-colors-${$highlight}Brand)
      `}
`;

const ExportText: FC<Props> = ({ className = '', children, $highlight, tiny, bold, size = 'sm', ellipsis,block, ...props }) => {
  return (
    <Text
      {...props}
      htmlFor={props.htmlFor}
      as={props.as || 'span'}
      className={`whitespace-pre-line
          ${tiny ? 'text-xs text-gray-400' : ''}
          ${bold ? 'font-bold' : ''}
          ${block ? 'block' : ''}
          ${size ? `text-${size}` : ''}
          ${ellipsis ? ` text-ellipsis overflow-hidden ` : ''}
        ${className} `.replace(/(\r\n|\n|\r)/gm, "").trim()}
    >
      {$highlight ? <StyledSpan $highlight={$highlight}>{children}</StyledSpan> : children}
    </Text>
  );
};

export default ExportText;