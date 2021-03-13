import React from 'react'

import { useRouter } from 'next/router'
import { useFormik } from 'formik'
import { useUpload, useQuery } from '../../../lib/graphql'
import Layout from '../../../components/Layout'
import Title from '../../../components/Title'
import Button from '../../../components/Button'

const UPDATE_BRAND_LOGO = `
mutation uploadBrandLogo($id: String!, $file: Upload!) {
  panelUploadBrandLogo (
    id: $id,
    file: $file
  )
} 
`

const Upload = () => {
  const router = useRouter()

  const { data } = useQuery(`
    query {
      getBrandById(id: "${router.query.id}"){
        name
        slug
      }
    }
  `)

  const [dataUpdated, updateBrand] = useUpload(UPDATE_BRAND_LOGO)
  const form = useFormik({
    initialValues: {
      id: router.query.id,
      file: ''
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
    }
  })
  return (
    <div>
      <Layout>
        <Title>Upload logo da marca: {data && data.getBrandById.name}</Title>

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
                  <input
                    type='file'
                    name='file'
                    onChange={event => {
                      form.setFieldValue('file', event.currentTarget.files[0])
                    }}
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

export default Upload
