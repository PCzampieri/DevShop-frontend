import React from 'react'
const Input = ({
  type = 'text',
  placeholder = '',
  label = '',
  value,
  onChange,
  onBlur,
  touched,
  name,
  helpText = null,
  errorMessage = '',
  ...rest
}) => {
  return (
    <div className='w-full px-3 py-1'>
      <label
        className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
        htmlFor={'id-' + name}
      >
        {label}
      </label>
      <input
        className='appearance-none block  w-full text-sm bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
        id={'id-' + name}
        type={type}
        placeholder={placeholder}
        value={value}
        autoComplete='off'
        onChange={onChange}
        onBlur={onBlur}
        touched={touched ? 1 : 0}
        name={name}
        {...rest}
      />
      {touched && errorMessage && (
        <p className='text-red-500 text-xs italic'>{errorMessage}</p>
      )}
      {helpText && (
        <p className='text-gray-600 text-xs italic mb-4'>{helpText}</p>
      )}
    </div>
  )
}
export default Input
