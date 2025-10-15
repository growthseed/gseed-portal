import { Layout } from '@/components/layout/Layout'

export default function Settings() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600 mt-1">Configure o sistema e suas preferências</p>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <p className="text-gray-500 text-center py-8">
            Configurações serão exibidas aqui
          </p>
        </div>
      </div>
    </Layout>
  )
}
