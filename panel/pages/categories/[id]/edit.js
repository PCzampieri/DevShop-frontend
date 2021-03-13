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

const UPDATE_CATEGORY = `
  mutation updateCategory($id: String!, $name: String!, $slug: String!) {
    panelUpdateCategory (input: {
      id: $id,
      name: $name,
      slug: $slug
    }) {
      id
      name
      slug
    }
  }
`

const CategorySchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Por favor, informe pelo menos um nome com 3 caracteres.')
    .required('Por favor, informe um nome.'),
  slug: Yup.string()
    .min(3, 'Por favor, informe um slug para a categoria mínimo 3 caracteres.')
    .required('Por favor, informe um slug para a categoria.')
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Por favor, informe um slug válido.')
    .test(
      'is-unique',
      'Por favor, utilize outro slug. Este já está em uso.',
      async value => {
        const response = await fetcher(
          JSON.stringify({
            query: `
                query {
                  getCategoryBySlug(slug:"${value}") {
                    id
                  }
                }
              `
          })
        )
        if (response.errors) {
          return true
        }
        if (response.data.getCategoryBySlug.id === id) {
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
      getCategoryById(id: "${router.query.id}"){
        name
        slug
      }
    }
  `)

  const [dataUpdated, updateCategory] = useMutation(UPDATE_CATEGORY)

  const form = useFormik({
    initialValues: {
      name: '',
      slug: ''
    },
    initialErrors: {
      name: '',
      slug: ''
    },
    onSubmit: async values => {
      const category = {
        ...values,
        id: router.query.id
      }
      const data = await updateCategory(category)
      if (data && !data.errors) {
        router.push('/categories')
      }
    },
    validationSchema: CategorySchema
  })
  useEffect(() => {
    if (data && data.getCategoryById) {
      form.setFieldValue('name', data.getCategoryById.name)
      form.setFieldValue('slug', data.getCategoryById.slug)
    }
  }, [data])
  return (
    <div>
      <Layout>
        <Title>Editar categoria</Title>

        <div className='mt-8'></div>

        <Button.LinkOutline href='/categories'>Voltar</Button.LinkOutline>

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
                    label='Nome da Categoria'
                    placeholder='Preencha com o nome da categoria'
                    name='name'
                    onChange={form.handleChange}
                    touched={form.touched.name}
                    onBlur={form.handleBlur}
                    value={form.values.name}
                    errorMessage={form.errors.name}
                  />
                  <Input
                    label='Slug da Categoria'
                    placeholder='Preencha com o slug da categoria'
                    name='slug'
                    onChange={form.handleChange}
                    touched={form.touched.slug}
                    onBlur={form.handleBlur}
                    value={form.values.slug}
                    errorMessage={form.errors.slug}
                  />
                </div>
                <Button type='submit'>Salvar categoria</Button>
              </form>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  )
}

export default Edit
