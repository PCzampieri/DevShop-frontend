import React, { useEffect, useState } from 'react'
import { AiOutlineGithub } from 'react-icons/ai'

import Link from 'next/link'

import * as Yup from 'yup'
import { useRouter } from 'next/router'
import Input from '../components/Input'
import Alert from '../components/Alert'
import { useFormik } from 'formik'
import Button from '../components/Button'
import { useMutation } from '../lib/graphql'

const AUTH = `
  mutation auth($email: String!, $password: String!) {
    auth (input: {
      email: $email,
      password: $password
    }) {
      refreshToken,
      accessToken
    }
  }
`

const SignInSchema = Yup.object().shape({
  email: Yup.string()
    .required('Por favor, informe um e-mail.')
    .email('Por favor, informe um e-mail válido.'),
  password: Yup.string()
    .min(6, 'Por favor, digite uma senha de no mínimo 6 caracteres.')
    .required('Por favor, informe uma senha.')
})

const Index = () => {
  const [signInError, setSignInError] = useState(false)
  const router = useRouter()
  const [authData, auth] = useMutation(AUTH)

  const form = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: SignInSchema,
    onSubmit: async values => {
      const data = await auth(values)

      if (data && data.data && data.data.auth) {
        localStorage.setItem('refreshToken', data.data.auth.refreshToken)
        localStorage.setItem('accessToken', data.data.auth.accessToken)
        router.push('/dashboard')
      } else {
        setSignInError(true)
      }
    }
  })

  useEffect(() => {
    if (
      localStorage.getItem('refreshToken') &&
      localStorage.getItem('accessToken')
    ) {
      router.push('/dashboard')
    }
  }, [])
  return (
    <div className='bg-gray-200 min-h-screen flex flex-col'>
      <div className='container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2'>
        <div className='bg-white px-6 py-8 rounded shadow-lg text-black w-full'>
          <h1 className='mb-8 text-3xl text-center'>Login</h1>
          <div className='my-3 mx-3'>
            {signInError && <Alert>E-mail e/ou senha inálidos.</Alert>}
          </div>
          <form onSubmit={form.handleSubmit}>
            <Input
              label='email'
              placeholder='Por favor, digite seu e-mail'
              name='email'
              errorMessage={form.errors.email}
              touched={form.touched.email}
              onBlur={form.handleBlur}
              onChange={form.handleChange}
              value={form.values.email}
            />
            <Input
              label='senha'
              placeholder='Por favor, digite sua senha'
              name='password'
              errorMessage={form.errors.password}
              touched={form.touched.password}
              onBlur={form.handleBlur}
              onChange={form.handleChange}
              value={form.values.password}
              type='password'
            />

            <div className='mt-3 mx-3'>
              <Button
                className='w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                type='submit'
              >
                Entrar
              </Button>
              <Link href='https://github.com/PCzampieri'>
                <a className='w-full flex justify-center mt-4'>
                  <AiOutlineGithub size={32} />
                </a>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Index
