import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CreateProjectForm from '@/components/projects/CreateProjectForm'

export default function CriarProjetoPage() {
  const navigate = useNavigate()

  return (
    <CreateProjectForm 
      onBack={() => navigate('/dashboard')} 
      type="projeto"
    />
  )
}
