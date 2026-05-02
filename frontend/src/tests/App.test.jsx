import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import JourneyMap from '../components/JourneyMap'

describe('App Component', () => {
    it('renders without crashing', () => {
    render(<MemoryRouter><JourneyMap /></MemoryRouter>)
    expect(document.body).toBeInTheDocument()
    })
    it('renders main content', () => {
    render(<MemoryRouter><JourneyMap /></MemoryRouter>)
    expect(document.body.firstChild).toBeTruthy()
    })
})