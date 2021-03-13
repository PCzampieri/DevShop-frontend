import React, { useEffect } from 'react'
import * as Yup from 'yup'

import { useRouter } from 'next/router'
import { useFormik } from 'formik'
import { useMutation, useQuery, fetcher } from '../../../lib/graphql'
import Layout from '../../../components/Layout'
import Title from '../../../components/Title'
import Button from '../../../components/Button'
import Input from '../../../components/Input'
import Select from '../../../components/Select'

const UPDATE_PRODUCT = `
  mutation updateProduct($id: String!, $name: String!, $slug: String!, $description: String!, $category: String!) {
    panelUpdateProduct (input: {
      id: $id,
      name: $name,
      slug: $slug,
      description: $description,
      category: $category
    }) {
      id
      name
      slug
      description
      category
    }
  }
`

const GET_ALL_CATEGORIES = `
  query{
    getAllCategories{
      id
      name
      slug
    }
  }
`

let id = ''

const ProductSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Por favor, informe pelo menos um nome com 3 caracteres.')
    .required('Por favor, informe um nome.'),
  description: Yup.string()
    .min(20, 'Por favor, informe uma descrição com no mínimo 20 caracteres.')
    .required('Por favor, informe uma descrição.'),
  slug: Yup.string()
    .min(3, 'Por favor, informe um slug para o produto mínimo 3 caracteres.')
    .required('Por favor, informe um slug para produto.')
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Por favor, informe um slug válido.')
    .test(
      'is-unique',
      'Por favor, utilize outro slug. Este já está em uso.',
      async value => {
        const response = await fetcher(
          JSON.stringify({
            query: `
                query {
                  getProductBySlug(slug:"${value}") {
                    id
                  }
                }
              `
          })
        )

        if (response.errors) {
          return true
        }
        console.log(id)
        if (response.data.getProductBySlug.id === id) {
          return true
        }
        return false
      }
    ),
  category: Yup.string()
    .min(1, 'Por favor, selecione uma categoria.')
    .required('Por favor, selecione uma categoria.')
})
const Edit = () => {
  const router = useRouter()
  id = router.query.id

  const { data } = useQuery(`
    query {
      getProductById(id: "${router.query.id}"){
        name
        slug
        description
        category
      }
    }
  `)

  const [dataUpdated, updateProduct] = useMutation(UPDATE_PRODUCT)
  const { data: categories, mutate } = useQuery(GET_ALL_CATEGORIES)

  const form = useFormik({
    initialValues: {
      name: '',
      slug: '',
      description: '',
      category: ''
    },
    initialErrors: {
      name: '',
      slug: '',
      description: '',
      category: ''
    },
    validationSchema: ProductSchema,
    onSubmit: async values => {
      const product = {
        ...values,
        id: router.query.id
      }
      const data = await updateProduct(product)
      console.log(data.errors)
      if (data && !data.errors) {
        router.push('/products')
      }
    }
  })
  useEffect(() => {
    if (data && data.getProductById) {
      form.setFieldValue('name', data.getProductById.name)
      form.setFieldValue('slug', data.getProductById.slug)
      form.setFieldValue('description', data.getProductById.description)
      form.setFieldValue('category', data.getProductById.category)
    }
  }, [data])

  let options = []
  if (categories && categories.getAllCategories) {
    options = categories.getAllCategories.map(item => {
      return {
        id: item.id,
        label: item.name
      }
    })
  }

  return (
    <div>
      <Layout>
        <Title>Editar produto</Title>

        <div className='mt-8'></div>

        <Button.LinkOutline href='/products'>Voltar</Button.LinkOutline>

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
                    label='Nome do produto'
                    placeholder='Preencha com o nome do produto'
                    name='name'
                    touched={form.touched.name}
                    onBlur={form.handleBlur}
                    onChange={form.handleChange}
                    value={form.values.name}
                    errorMessage={form.errors.name}
                  />
                  <Input
                    label='Descrição do produto'
                    placeholder='Preencha com a descrição do produto'
                    name='description'
                    touched={form.touched.description}
                    onBlur={form.handleBlur}
                    onChange={form.handleChange}
                    value={form.values.description}
                    errorMessage={form.errors.description}
                  />
                  <Input
                    label='Slug do produto'
                    placeholder='Preencha com o slug do produto'
                    name='slug'
                    touched={form.touched.slug}
                    onBlur={form.handleBlur}
                    onChange={form.handleChange}
                    value={form.values.slug}
                    errorMessage={form.errors.slug}
                  />
                  <Select
                    label='Selecione a categoria'
                    name='category'
                    touched={form.touched.category}
                    onBlur={form.handleBlur}
                    onChange={form.handleChange}
                    value={form.values.category}
                    options={options}
                    errorMessage={form.errors.category}
                    initial={{ id: '', label: 'Selecione...' }}
                  />
                </div>
                <Button type='submit'>Salvar produto</Button>
              </form>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  )
}

export default Edit
