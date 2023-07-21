import classNames from 'classnames';

const Input = ({
  type,
  name,
  value,
  placeholder,
  className,
  label,
  ...rest
}) => {
  const baseClassNames = classNames(
    'appearance-none rounded-lg py-3 px-4 bg-white border text-[#6B7280] text-[17px] border-solid leading-tight focus:outline-none focus:shadow-outline',
    className
  );

  return (
    <div>
      {label && (
        <label
          className='flex justify-start mt-8 mb-1 text-label text-shade13'
          htmlFor={name}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        id={name}
        value={value}
        className={baseClassNames}
        {...rest}
      />
    </div>
  );
};

export default Input;
