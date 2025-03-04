import React, { FC } from 'react';

interface Props {
  className?: string;
  value: any;
  placeholder: any;
  onChange: any;
}

const TextArea: FC<Props> = ({ className = '', ...props }) => {
  return (
    <textarea
      {...props}
      className={
        `w-64 block m-2 p-2 border border-blue-400 rounded-md text-blue-400
        ${className} `
      }
    />
  )
}

export default TextArea;
