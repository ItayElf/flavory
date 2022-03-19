interface Props {
  type: string;
  label: string;
  className?: string;
  required?: boolean;
  value: string;
  setValue: (value: string) => void;
}

export function TextField({
  type,
  label,
  className,
  value,
  setValue,
  required,
}: Props) {
  return (
    <div className="relative flex flex-col">
      <input
        id={label}
        type={type}
        value={value}
        className={
          "h5 w-100 peer rounded border-none bg-primary-50 placeholder-transparent focus:border-0 focus:border-b-2 focus:border-solid focus:border-primary-600 focus:ring-0 focus:ring-offset-0 " +
          className
        }
        placeholder={label}
        onChange={(e) => setValue(e.target.value)}
        required={required}
      />
      <label
        htmlFor={label}
        className="s1 peer-placeholder-shown:h5 absolute -top-3.5 left-3 text-black peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray"
      >
        {label}
      </label>
    </div>
  );
}
