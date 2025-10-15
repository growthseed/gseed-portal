import { useParams } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'

export default function MentorDetail() {
  const { id } = useParams()

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Detalhes do Mentor</h1>
          <p className="text-gray-600 mt-1">ID: {id}</p>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <p className="text-gray-500 text-center py-8">
            Detalhes do mentor serão exibidos aqui
          </p>
        </div>
      </div>
    </Layout>
  )
}
