import { render, screen } from '@testing-library/react'
import { Text } from './Text'

describe('<Text />', () => {
  it('Should render Text correctly', () => {
    render(<Text>Test</Text>)
    const text = screen.getByText('Test')
    expect(text).toBeDefined()
  })
})
