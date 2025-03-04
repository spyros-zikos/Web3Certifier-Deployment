import React, { FC } from 'react';

interface Props {
  className?: string;
  children: any;
  onClick: any;
}

const Button: FC<Props> = ({ className = '', children, ...props }) => {
  return (
    <button 
      {...props}
      className={
        `m-2 p-2 border border-blue-400 rounded-md text-blue-400
        ${className} `
      }
    >
      {children}
    </button>
  )
}

export default Button;
