function PageWrapper({
    children,
    className = "",
    align = "center",
  }: {
    children: React.ReactNode;
    className?: string;
    align?: string;
  }) {
    return (
      <div className={`flex items-${align} flex-col flex-grow p-5 w-full max-w-screen-xl mx-auto ${className}`}>
        {children}
      </div>
    );
  }
  export default PageWrapper;