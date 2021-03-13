import React from 'react'
import Link from 'next/link'

const Button = ({ children, customClass, ...rest }) => {
  return (
    <button
      className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
      {...rest}
    >
      {children}
    </button>
  )
}

const ButtonLink = ({ href, children, ...rest }) => {
  return (
    <Link href={href}>
      <a
        className={
          'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        }
        {...rest}
      >
        {children}
      </a>
    </Link>
  )
}

const ButtonLinkOutline = ({ href, children, ...rest }) => {
  return (
    <Link href={href}>
      <a
        className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-700 hover:border-transparent rounded'
        {...rest}
      >
        {children}
      </a>
    </Link>
  )
}

Button.Link = ButtonLink
Button.LinkOutline = ButtonLinkOutline

export default Button
