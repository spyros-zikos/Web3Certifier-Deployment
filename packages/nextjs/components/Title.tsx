import React, { FC } from 'react';

interface Props {
  className?: string;
  children: any;
}

// const Title: FC<Props> = ({ className = '', children, ...props }) => {
//   return (
//     <div 
//       {...props}
//       className={
//         `block mx-2 my-3 mb-6 p-0 text-3xl font-bold
//         ${className} `
//       }
//     >
//       {children}
//     </div>
//   )
// }

const Title: FC<Props> = ({ className = '', children, ...props }) => {
  return (
    <div 
      {...props}
      className={
        `m-0 mb-14 w-full text-[34px] font-bold
        ${className} `
      }
    >
      {children}
    </div>
  )
}

export default Title;
