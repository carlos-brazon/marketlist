import React from 'react'

const Input = ({ type, name, onChange, value, placeholder, minLength, maxLength, className, required }) => {
  return (
    <input
      className={`rounded-md border border-gray-500 hover:border-blueinput focus:border outline-2 outline-aquainput p-2 ${className}`}
      type={type}
      name={name}
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      minLength={minLength}
      maxLength={maxLength}
      required = {required}
    />
  )
}

export default Input