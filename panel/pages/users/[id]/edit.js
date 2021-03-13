import React, { useEffect } from 'react'
import * as Yup from 'yup'

import { useRouter } from 'next/router'
import { useFormik } from 'formik'
import { useMutation, useQuery, fetcher } from '../../../lib/graphql'
import Layout from '../../../components/Layout'
import Title from '../../../components/Title'
import Button from '../../../components/Button'
import Input from '../../../components/Input'

let id = ''

const UPDATE_USER = `
  mutation updateUser($id: String!, $name: String!, $email: String!, $role: String!) {
    panelUpdateUser (input: {
      id: $id,
      name: $name,
      email: $email,
      role: $role
    }) {
      id
      name
      email
      role
    }
  }
`

const UserSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Por favor, informe pelo menos um nome com 3 caracteres.')
    .required('Por favor, informe um nome.'),

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
        if (response.data.panelGetUserByEmail.id === id) {
          return true
        }
        return false
      }
    )
})

const Edit = () => {
  const router = useRouter()
  id = router.query.id

  const { data } = useQuery(`
    query {
      panelGetUserById(id: "${router.query.id}"){
        name
        email
        role
      }
    }
  `)

  const [dataUpdated, updateUser] = useMutation(UPDATE_USER)

  const form = useFormik({
    initialValues: {
      name: '',
      email: '',
      role: ''
    },
    validationSchema: UserSchema,
    onSubmit: async values => {
      const user = {
        ...values,
        id: router.query.id
      }
      const data = await updateUser(user)
      console.log(data)
      if (data && !data.errors) {
        router.push('/users')
      }
    }
  })

  useEffect(() => {
    if (data && data.panelGetUserById) {
      form.setFieldValue('name', data.panelGetUserById.name)
      form.setFieldValue('email', data.panelGetUserById.email)
      form.setFieldValue('role', data.panelGetUserById.role)
    }
  }, [data])
  return (
    <div>
      <Layout>
        <Title>Editar usuário</Title>

        <div className='mt-8'></div>

        <Button.LinkOutline href='/users'>Voltar</Button.LinkOutline>

        <div className='flex flex-col mt-8'>
          <div className='-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8'>
            <div className='align-middle inline-block min-w-full bg-white shadow overflow-hidden sm:rounded-lg border-b border-gray-200 p-8'>
              {dataUpdated && !!dataUpdated.errors && (
                <p className='bg-red-100 border border-red-400 text-red-700 pl-4 pr-8 py-3 mb-4 rounded'>
                  Ocorreu um erro ao salvar os dados.
                </p>
              )}
              <form onSubmit={form.handleSubmit}>
                <div className='flex flex-wrap -mx-3 mb-6'>
                  <Input
                    label='Nome'
                    placeholder='Preencha com o nome do usuário'
                    name='name'
                    onChange={form.handleChange}
                    touched={form.touched.name}
                    onBlur={form.handleBlur}
                    value={form.values.name}
                    errorMessage={form.errors.name}
                  />
                  <Input
                    label='E-mail'
                    placeholder='Preencha com o e-mail do usuário'
                    name='email'
                    onChange={form.handleChange}
                    touched={form.touched.email}
                    onBlur={form.handleBlur}
                    value={form.values.email}
                    errorMessage={form.errors.email}
                  />
                  <Input
                    label='role'
                    placeholder='Preencha com a role do usuário'
                    name='role'
                    onChange={form.handleChange}
                    touched={form.touched.role}
                    onBlur={form.handleBlur}
                    value={form.values.role}
                    errorMessage={form.errors.role}
                  />
                </div>
                <Button type='submit'>Salvar usuário</Button>
              </form>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  )
}

export default Edit
