import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Quiz from '../components/Quiz'

describe('Quiz Component', () => {
  it('renders quiz component', () => {
    const { container } = render(<Quiz />)
    expect(container).toBeTruthy()
  })
  it('quiz has content', () => {
    const { container } = render(<Quiz />)
    expect(container.firstChild).not.toBeNull()
  })
})