import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

describe('Home Page', () => {
  it('should render the main title', () => {
    render(<Home />)
    
    const title = screen.getByRole('heading', { name: /味ばあ/i })
    expect(title).toBeInTheDocument()
  })

  it('should render the subtitle', () => {
    render(<Home />)
    
    const subtitle = screen.getByText(/おばあちゃんの味を次世代へ/i)
    expect(subtitle).toBeInTheDocument()
  })

  it('should have proper styling classes', () => {
    render(<Home />)
    
    const main = screen.getByRole('main')
    expect(main).toHaveClass('min-h-screen', 'bg-wa-cream')
  })
})