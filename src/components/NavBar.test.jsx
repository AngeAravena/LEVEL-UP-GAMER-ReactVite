import { render, screen } from '@testing-library/react'
import NavBar from './NavBar'

test('muestra el logo', () => {
  render(<NavBar />)
  expect(screen.getByAltText(/logo/i)).toBeInTheDocument()
})