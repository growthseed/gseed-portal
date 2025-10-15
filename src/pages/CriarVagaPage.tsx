import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CreateProjectForm from '@/components/projects/CreateProjectForm'

export default function CriarVagaPage() {
  const navigate = useNavigate()

  return (
    <CreateProjectForm 
      onBack={() => navigate('/dashboard')} 
      type="vaga"
    />
  )
}
