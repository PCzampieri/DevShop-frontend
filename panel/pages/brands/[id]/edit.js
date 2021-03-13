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

const UPDATE_BRAND = `
  mutation updateBrand($id: String!, $name: String!, $slug: String!) {
    panelUpdateBrand (input: {
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
        if (response.data.getBrandBySlug.id === id) {
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
      getBrandById(id: "${router.query.id}"){
        name
        slug
      }
    }
  `)

  const [dataUpdated, updateBrand] = useMutation(UPDATE_BRAND)

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
      const brand = {
        ...values,
        id: router.query.id
      }
      const data = await updateBrand(brand)
      if (data && !data.errors) {
        router.push('/brands')
      }
    },
    validationSchema: BrandSchema
  })
  useEffect(() => {
    if (data && data.getBrandById) {
      form.setFieldValue('name', data.getBrandById.name)
      form.setFieldValue('slug', data.getBrandById.slug)
    }
  }, [data])
  return (
    <div>
      <Layout>
        <Title>Editar marca</Title>

        <div className='mt-8'></div>

        <Button.LinkOutline href='/brands'>Voltar</Button.LinkOutline>

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
                    label='Nome da marca'
                    placeholder='Preencha com o nome da marca'
                    name='name'
                    onChange={form.handleChange}
                    touched={form.touched.name}
                    onBlur={form.handleBlur}
                    value={form.values.name}
                    errorMessage={form.errors.name}
                  />
                  <Input
                    label='Slug da marca'
                    placeholder='Preencha com o slug da marca'
                    name='slug'
                    onChange={form.handleChange}
                    touched={form.touched.slug}
                    onBlur={form.handleBlur}
                    value={form.values.slug}
                    errorMessage={form.errors.slug}
                  />
                </div>
                <Button type='submit'>Salvar marca</Button>
              </form>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  )
}

export default Edit
