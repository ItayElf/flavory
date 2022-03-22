import { MdWarning } from "react-icons/md";

interface Props {
  className?: string;
}

export function NotFound({ className }: Props) {
  return (
    <div
      className={`flex w-full items-center justify-center p-8 sm:p-4 lg:p-2 ${className}`}
    >
      <div className="flex max-w-full shrink-0 flex-col items-center justify-center rounded bg-white p-8 shadow-md shadow-primary-200">
        <MdWarning className="sm:w-30 sm:h-30 h-20 w-20 text-primary-600 lg:h-32 lg:w-32" />
        <h1 className="h5 sm:h3 lg:h3 text-primary-900">404 NOT FOUND</h1>
        <h2 className="s1 sm:h5 lg:h4 text-center">
          The page you were looking for does't exist.
        </h2>
      </div>
    </div>
  );
}
