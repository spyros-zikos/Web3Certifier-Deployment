import React, { FC } from 'react';

interface Props {
  className?: string;
  value: any;
  type?: any;
  placeholder?: any;
  onChange: any;
}

const Input: FC<Props> = ({ className = '', ...props }) => {
  return (
    <input
      {...props}
      className={
        `w-[210px] block m-2 p-2 border border-blue-400 rounded-md text-blue-400
        ${className} `
      }
    />
  )
}

export default Input;
