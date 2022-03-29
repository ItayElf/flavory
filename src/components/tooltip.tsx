interface Props {
  title: string;
  className?: string;
}

const Tooltip: React.FC<Props> = ({ title, className, children }) => {
  return (
    <div className="relative">
      <div className="peer">{children}</div>
      <div
        className={`b1 invisible absolute top-10 left-1/2 flex w-max -translate-x-1/2 items-center justify-center rounded-md bg-primary-200 p-2 shadow-md peer-hover:visible ${className}`}
      >
        {title}
      </div>
    </div>
  );
};

export default Tooltip;
