interface Props extends Props2 {
  type: string;
  options?: string[];
}

interface Props2 {
  label: string;
  className?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  required?: boolean;
  value: string;
  setValue: (value: string) => void;
  id?: string;
}

export function TextField({
  type,
  label,
  className,
  wrapperClassName,
  labelClassName,
  value,
  setValue,
  required,
  options,
  id,
}: Props) {
  return (
    <div className={`relative flex flex-col ${wrapperClassName}`}>
      <input
        id={id ?? label}
        type={type}
        value={value}
        className={`h5 peer w-full rounded border-none bg-primary-50 placeholder-transparent focus:border-0 focus:border-b-2 focus:border-solid focus:border-primary-600 focus:ring-0 focus:ring-offset-0 ${className}`}
        placeholder={label}
        onChange={(e) => setValue(e.target.value)}
        required={required}
        list={`${id ?? label} list`}
      />
      <label
        htmlFor={id ?? label}
        className={`s1 peer-placeholder-shown:h5 absolute -top-3.5 left-3 text-black peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray ${labelClassName}`}
      >
        {label}
      </label>
      {options && (
        <datalist id={`${id ?? label} list`}>
          {options.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </datalist>
      )}
    </div>
  );
}

export const TextArea = ({
  label,
  className,
  wrapperClassName,
  labelClassName,
  value,
  setValue,
  required,
  id,
}: Props2) => {
  return (
    <div className={`relative flex flex-col ${wrapperClassName}`}>
      <textarea
        id={id ?? label}
        value={value}
        className={`h5 peer w-full rounded border-none bg-primary-50 placeholder-transparent focus:border-0 focus:border-b-2 focus:border-solid focus:border-primary-600 focus:ring-0 focus:ring-offset-0 ${className}`}
        placeholder={label}
        onChange={(e) => setValue(e.target.value)}
        required={required}
      />
      <label
        htmlFor={id ?? label}
        className={`s1 peer-placeholder-shown:h5 absolute -top-3.5 left-3 text-black peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray ${labelClassName}`}
      >
        {label}
      </label>
    </div>
  );
};
