import React from 'react'

import { formatDistance } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import Alert from '../../../components/Alert'
import Layout from '../../../components/Layout'
import Table from '../../../components/Table'
import Title from '../../../components/Title'
import { useMutation, useQuery } from '../../../lib/graphql'
import { useRouter } from 'next/router'

const INVALIDADE_USER_SESSION = `
  mutation panelInvalidadeUserSession($id: String!) {
    panelInvalidadeUserSession (id: $id)
  }
`
const Index = () => {
  const router = useRouter()
  const { data, mutate } = useQuery(`
  query {
    panelGetAllUserSessions(id: "${router.query.id}"){
      id
      userAgent    
      lastUsedAt
      active    
    }
  }
`)

  // eslint-disable-next-line no-unused-vars
  const [dataDeleted, deleteUser] = useMutation(INVALIDADE_USER_SESSION)

  const remove = id => async () => {
    await deleteUser({ id })
    mutate()
  }
  return (
    <Layout>
      <Title>Minhas sessões</Title>
      <div className='mt-8'></div>

      <div className='flex flex-col mt-8'>
        <div className='-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8'>
          {data &&
            data.panelGetAllUserSessions &&
            data.panelGetAllUserSessions.length === 0 && (
              <Alert>Você não tem sessões ativas.</Alert>
            )}

          {data &&
            data.panelGetAllUserSessions &&
            data.panelGetAllUserSessions.length > 0 && (
              <div className='align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200'>
                <Table>
                  <Table.Head>
                    <Table.Th>Sessões</Table.Th>
                    <Table.Th>Usado em</Table.Th>
                    <Table.Th></Table.Th>
                  </Table.Head>

                  <Table.Body>
                    {data &&
                      data.panelGetAllUserSessions.map(item => (
                        <Table.Tr key={item.id}>
                          <Table.Td>
                            <div className='flex items-center'>
                              <div>
                                <div className='text-sm leading-5 font-medium text-gray-900'>
                                  {item.id}
                                </div>
                                <div className='text-sm leading-5 text-gray-500'>
                                  {item.userAgent}
                                </div>
                              </div>
                            </div>
                          </Table.Td>
                          <Table.Td>
                            {formatDistance(
                              new Date(item.lastUsedAt),
                              new Date(),
                              { locale: ptBR }
                            )}{' '}
                            atrás
                          </Table.Td>

                          <Table.Td>
                            {item.active && (
                              <a
                                href='#'
                                className='text-indigo-600 hover:text-indigo-900'
                                onClick={remove(item.id)}
                              >
                                Remove
                              </a>
                            )}
                            {!item.active && (
                              <span className='text-xs font-semibold inline-block py-1 px-2 rounded-xl text-pink-600 bg-pink-200 last:mr-0 mr-1'>
                                Inativo
                              </span>
                            )}
                          </Table.Td>
                        </Table.Tr>
                      ))}
                  </Table.Body>
                </Table>
              </div>
            )}
        </div>
      </div>
    </Layout>
  )
}
export default Index
