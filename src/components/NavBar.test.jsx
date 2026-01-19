import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { NavBar } from './NavBar'

// 🔹 Mock del contexto
vi.mock('../context/AppContext.jsx', () => ({
  useApp: vi.fn(),
}))

import { useApp } from '../context/AppContext.jsx'

// 🔧 Helper para renderizar con router
const renderWithRouter = (ui) => {
  return render(
    <MemoryRouter>
      {ui}
    </MemoryRouter>
  )
}

describe('NavBar', () => {
  it('muestra Login y Registro cuando no hay sesión', () => {
    useApp.mockReturnValue({
      session: null,
      cartCount: 3,
      logout: vi.fn(),
    })

    renderWithRouter(<NavBar />)

    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.getByText('Registro')).toBeInTheDocument()
    expect(screen.getByText(/Carrito/i)).toBeInTheDocument()
    expect(screen.queryByText(/Hola,/i)).not.toBeInTheDocument()
  })

  it('muestra saludo y botón de cerrar sesión cuando hay sesión admin', () => {
    const logoutMock = vi.fn()

    useApp.mockReturnValue({
      session: {
        name: 'Carlos',
        role: 'admin',
      },
      cartCount: 1,
      logout: logoutMock,
    })

    renderWithRouter(<NavBar />)

    // saludo
    expect(screen.getByText('Hola, Carlos')).toBeInTheDocument()

    // botón cerrar sesión
    const logoutButton = screen.getByText('Cerrar sesión')
    expect(logoutButton).toBeInTheDocument()

    fireEvent.click(logoutButton)
    expect(logoutMock).toHaveBeenCalled()

    // link admin correcto
    const adminLink = screen.getByText('Admin')
    expect(adminLink.getAttribute('href')).toBe('/admin')
  })
})
