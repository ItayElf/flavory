interface Props {
  className?: string;
  onClick?: () => void;
}

export const ButtonSecondary: React.FC<Props> = ({
  children,
  className,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`h4 rounded border-2 border-primary-600 px-5 py-2 text-primary-600 hover:border-primary-900 hover:text-primary-900  ${className}`}
    >
      {children}
    </button>
  );
};
