import React from 'react'
import Layout from '../../components/Layout'
import * as Yup from 'yup'

import Title from '../../components/Title'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { useMutation, fetcher } from '../../lib/graphql'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'

const CREATE_BRAND = `
    mutation createBrand($name: String!, $slug: String!) {
      panelCreateBrand (input: {
        name: $name,
        slug: $slug
      }) {
        id
        name
        slug
      }
    }
  `
const BrandSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Por favor, informe pelo menos um nome com 3 caracteres.')
    .required('Por favor, informe um nome.'),
  slug: Yup.string()
    .min(3, 'Por favor, informe um slug para a marca mínimo 3 caracteres.')
    .required('Por favor, informe um slug para a marca.')
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Por favor, informe um slug válido.')
    .test(
      'is-unique',
      'Por favor, utilize outro slug. Este já está em uso.',
      async value => {
        const response = await fetcher(
          JSON.stringify({
            query: `
                query {
                  getBrandBySlug(slug:"${value}") {
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
  const [data, createBrand] = useMutation(CREATE_BRAND)
  const form = useFormik({
    initialValues: {
      name: '',
      slug: ''
    },
    validationSchema: BrandSchema,
    onSubmit: async values => {
      const data = await createBrand(values)
      if (data && !data.errors) {
        router.push('/brands')
      }
    }
  })
  return (
    <Layout>
      <Title>Criar nova marca</Title>

      <div className='mt-8'></div>

      <Button.LinkOutline href='/brands'>Voltar</Button.LinkOutline>

      <div className='mt-8'></div>

      <div className='flex flex-col mt-8'>
        <div className='-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8'>
          <div className='align-middle inline-block min-w-full bg-white shadow overflow-hidden sm:rounded-lg border-b border-gray-200 p-8'>
            <form onSubmit={form.handleSubmit}>
              <div className='flex flex-wrap -mx-3 mb-6'>
                <Input
                  label='Nome da marca'
                  placeholder='Preencha com o nome da marca'
                  name='name'
                  errorMessage={form.errors.name}
                  touched={form.touched.name}
                  onBlur={form.handleBlur}
                  onChange={form.handleChange}
                  value={form.values.name}
                />
                <Input
                  label='Slug da marca'
                  placeholder='Preencha com o slug da marca'
                  name='slug'
                  errorMessage={form.errors.slug}
                  touched={form.touched.slug}
                  onBlur={form.handleBlur}
                  onChange={form.handleChange}
                  value={form.values.slug}
                />
              </div>
              <Button type='submit'>Criar marca</Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}
export default Index
