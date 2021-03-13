import React from 'react'

const Alert = ({children}) => {
  return (
    <article className="bg-yellow-100 border-l-4 border-yellow-600 text-yellow-600 p-4 rounded-sm" role="alert">
      {children}
    </article>
  )  
}

export default Alert