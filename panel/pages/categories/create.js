import React from 'react'
import Layout from '../../components/Layout'
import * as Yup from 'yup'

import Title from '../../components/Title'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { useMutation, fetcher } from '../../lib/graphql'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'

const CREATE_CATEGORY = `
    mutation createCategory($name: String!, $slug: String!) {
      panelCreateCategory (input: {
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
        return false
      }
    )
})

const Index = () => {
  const router = useRouter()
  const [data, createCategory] = useMutation(CREATE_CATEGORY)
  const form = useFormik({
    initialValues: {
      name: '',
      slug: ''
    },
    validationSchema: CategorySchema,
    onSubmit: async values => {
      const data = await createCategory(values)
      if (data && !data.errors) {
        router.push('/categories')
      }
    }
  })
  return (
    <Layout>
      <Title>Criar nova categoria</Title>

      <div className='mt-8'></div>

      <Button.LinkOutline href='/categories'>Voltar</Button.LinkOutline>

      <div className='mt-8'></div>

      <div className='flex flex-col mt-8'>
        <div className='-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8'>
          <div className='align-middle inline-block min-w-full bg-white shadow overflow-hidden sm:rounded-lg border-b border-gray-200 p-8'>
            <form onSubmit={form.handleSubmit}>
              <div className='flex flex-wrap -mx-3 mb-6'>
                <Input
                  label='Nome da Categoria'
                  placeholder='Preencha com o nome da categoria'
                  name='name'
                  errorMessage={form.errors.name}
                  touched={form.touched.name}
                  onBlur={form.handleBlur}
                  onChange={form.handleChange}
                  value={form.values.name}
                />
                <Input
                  label='Slug da Categoria'
                  placeholder='Preencha com o slug da categoria'
                  name='slug'
                  errorMessage={form.errors.slug}
                  touched={form.touched.slug}
                  onBlur={form.handleBlur}
                  onChange={form.handleChange}
                  value={form.values.slug}
                />
              </div>
              <Button type='submit'>Criar categoria</Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}
export default Index
