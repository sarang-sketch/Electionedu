import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Glossary from '../components/Glossary'

describe('Glossary Component', () => {
  it('renders glossary title', () => {
    render(<Glossary />)
    expect(screen.getByText(/Glossary/i)).toBeInTheDocument()
  })
})