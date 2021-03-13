import React from 'react'
import Layout from '../../components/Layout'
import * as Yup from 'yup'

import Title from '../../components/Title'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { useMutation, fetcher } from '../../lib/graphql'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'

const CREATE_USER = `
    mutation createUser($name: String!, $email: String!, $password: String!, $role: String!) {
      panelCreateUser (input: {
        name: $name,
        email: $email,
        password: $password,
        role: $role,
      }) {
        id
        name
        email
      }
    }
  `
const UserSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Por favor, informe pelo menos um nome com 3 caracteres.')
    .required('Por favor, informe um nome.'),
  password: Yup.string()
    .min(6, 'Por favor, informe uma senha com no mínimo 6 caracteres.')
    .required('Por favor, informe uma senha.'),
  role: Yup.string()
    .required('Por favor, informe uma role.')
    .min(3, 'Por favor, informe uma role com no mínimo 3 caracteres.'),

  email: Yup.string()
    .email('Por favor, informe um e-mail válido.')
    .required('Por favor, informe um e-mail.')
    .test(
      'is-unique',
      'Por favor, utilize outro e-mail. Este já está em uso por outro usuário.',
      async value => {
        const response = await fetcher(
          JSON.stringify({
            query: `
                query {
                  panelGetUserByEmail(email:"${value}") {
                    id
                  }
                }
              `
          })
        )
        if (response.errors) {
          return true
        }
        return false
      }
    )
})

const Index = () => {
  const router = useRouter()
  const [data, createUser] = useMutation(CREATE_USER)
  const form = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      role: ''
    },
    validationSchema: UserSchema,
    onSubmit: async values => {
      const data = await createUser(values)
      if (data && !data.errors) {
        router.push('/users')
      }
    }
  })
  return (
    <Layout>
      <Title>Criar novo usuário</Title>

      <div className='mt-8'></div>

      <Button.LinkOutline href='/users'>Voltar</Button.LinkOutline>

      <div className='mt-8'></div>

      <div className='flex flex-col mt-8'>
        <div className='-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8'>
          <div className='align-middle inline-block min-w-full bg-white shadow overflow-hidden sm:rounded-lg border-b border-gray-200 p-8'>
            <form onSubmit={form.handleSubmit}>
              <div className='flex flex-wrap -mx-3 mb-6'>
                <Input
                  label='Nome'
                  placeholder='Preencha com o nome do usuário'
                  name='name'
                  errorMessage={form.errors.name}
                  touched={form.touched.name}
                  onBlur={form.handleBlur}
                  onChange={form.handleChange}
                  value={form.values.name}
                />
                <Input
                  label='E-mail'
                  placeholder='Preencha com o nome do usuário'
                  name='email'
                  errorMessage={form.errors.email}
                  touched={form.touched.email}
                  onBlur={form.handleBlur}
                  onChange={form.handleChange}
                  value={form.values.email}
                />
                <Input
                  label='Senha'
                  placeholder='Preencha com a senha'
                  name='password'
                  errorMessage={form.errors.password}
                  touched={form.touched.password}
                  onBlur={form.handleBlur}
                  onChange={form.handleChange}
                  value={form.values.password}
                />
                <Input
                  label='Role'
                  placeholder='Preencha com a role'
                  name='role'
                  errorMessage={form.errors.role}
                  touched={form.touched.role}
                  onBlur={form.handleBlur}
                  onChange={form.handleChange}
                  value={form.values.role}
                />
              </div>
              <Button type='submit'>Criar usuário</Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}
export default Index
