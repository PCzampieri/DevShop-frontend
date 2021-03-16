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

const UPDATE_PASSWORD = `
  mutation updateUser($id: String!, $password: String!) {
    panelChangeUserPassword (input: {
      id: $id,
      password: $password,
    
    }) 
  }
`

const UserSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, 'Por favor, informe uma senha com no mínimo 6 caracteres.')
    .required('Por favor, informe uma senha.')
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

  const [dataUpdated, updateUser] = useMutation(UPDATE_PASSWORD)

  const form = useFormik({
    initialValues: {
      password: ''
    },
    validationSchema: UserSchema,
    onSubmit: async values => {
      const user = {
        ...values,
        id: router.query.id
      }
      const data = await updateUser(user)
      if (data && !data.errors) {
        router.push('/users')
      }
    }
  })

  return (
    <div>
      <Layout>
        <Title>
          Alterar senha:{' '}
          {data && data.panelGetUserById && data.panelGetUserById.name}{' '}
        </Title>

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
                    label='Nova senha'
                    placeholder='Preencha com a nova do usuário'
                    name='password'
                    onChange={form.handleChange}
                    touched={form.touched.password}
                    onBlur={form.handleBlur}
                    value={form.values.password}
                    errorMessage={form.errors.password}
                  />
                </div>
                <Button type='submit'>Salvar nova senha</Button>
              </form>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  )
}

export default Edit
