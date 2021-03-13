import React, { useState } from 'react'
import { AiOutlineGithub } from 'react-icons/ai'
import { useRouter } from 'next/router'
import Link from 'next/link'

import { useQuery } from '../../lib/graphql'
import Menu from '../Menu'
import { MdLabel, MdHome } from 'react-icons/md'
const GET_ME = `
  query {
    panelGetMe{
      id
      name
      email
    }
  }
`

const Layout = ({ children }) => {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { data } = useQuery(GET_ME)

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    router.push('/')
  }

  return (
    <div>
      <div className='flex h-screen transition duration-300'>
        <div
          className={
            'z-30 inset-y-0 left-0 w-64 transform bg-gray-900 overflow-y-auto translate-x-0 inset-0 ' +
            (sidebarOpen
              ? 'transition duration-300 translate-x-0 ease-out static '
              : 'transition duration-300 -translate-x-full ease-in fixed ')
          }
        >
          <Menu.Brand>DevShop</Menu.Brand>

          <Menu.Nav>
            <Menu.NavItem href='/dashboard' Icon={MdHome}>
              Dashboard
            </Menu.NavItem>
            <Menu.NavItem href='/brands' Icon={MdLabel}>
              Marcas
            </Menu.NavItem>
            <Menu.NavItem href='/categories' Icon={MdLabel}>
              Categorias
            </Menu.NavItem>
            <Menu.NavItem href='/products' Icon={MdLabel}>
              Produtos
            </Menu.NavItem>
            <Menu.NavItem href='/users' Icon={MdLabel}>
              Usuários
            </Menu.NavItem>
          </Menu.Nav>
        </div>
        <div className='flex-1 flex flex-col overflow-hidden'>
          <header className='flex justify-between items-center py-4 px-6 bg-white border-b-2 border-indigo-600'>
            <div className='flex items-center'>
              <button
                onClick={() => setSidebarOpen(old => !old)}
                className='text-gray-500 focus:outline-none'
              >
                <svg
                  className='h-6 w-6'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M4 6H20M4 12H20M4 18H11'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </button>
            </div>
            <Link href='https://github.com/PCzampieri'>
              <a>
                <AiOutlineGithub size={32} />
              </a>
            </Link>

            <div className='flex items-center'>
              <span className='mr-4'>
                Olá, {data && data.panelGetMe.name.split(' ')[0]}
              </span>
              <div className='relative'>
                <button
                  onClick={() => setDropdownOpen(old => !old)}
                  className='relative z-10 block h-8 w-8 rounded-full overflow-hidden shadow focus:outline-none'
                >
                  <img
                    className='h-full w-full object-cover'
                    src='https://images.unsplash.com/photo-1528892952291-009c663ce843?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=296&q=80'
                    alt='Your avatar'
                  />
                </button>

                <div
                  onClick={() => setDropdownOpen(false)}
                  className={
                    'fixed inset-0 h-full w-full z-10 ' + dropdownOpen
                      ? 'block '
                      : ''
                  }
                ></div>

                {dropdownOpen && (
                  <div
                    className={
                      'absolute right-0 mt-2 py-2 w-48 bg-white border-2 border-gray-50 rounded-md shadow-xl z-20 '
                    }
                  >
                    <a
                      href={`/users/${data && data.panelGetMe.id}/mysessions`}
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-600 hover:text-white'
                    >
                      Minhas sessões
                    </a>

                    <a
                      href='#'
                      onClick={() => logout()}
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-600 hover:text-white'
                    >
                      Logout
                    </a>
                  </div>
                )}
              </div>
            </div>
          </header>
          <main className='flex-1 overflow-x-hidden overflow-y-auto bg-gray-200'>
            <div className='container mx-auto px-6 py-8'>{children}</div>
          </main>
        </div>
      </div>
    </div>
  )
}
export default Layout
