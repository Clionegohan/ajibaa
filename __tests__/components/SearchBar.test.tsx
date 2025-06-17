import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import SearchBar from '@/components/SearchBar'

describe('SearchBar', () => {
  const mockOnSearch = jest.fn()

  beforeEach(() => {
    mockOnSearch.mockClear()
  })

  it('should render search input field', () => {
    render(<SearchBar onSearch={mockOnSearch} />)
    
    expect(screen.getByPlaceholderText('レシピを検索...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '検索' })).toBeInTheDocument()
  })

  it('should call onSearch when search button is clicked', () => {
    render(<SearchBar onSearch={mockOnSearch} />)
    
    const searchInput = screen.getByPlaceholderText('レシピを検索...')
    const searchButton = screen.getByRole('button', { name: '検索' })
    
    fireEvent.change(searchInput, { target: { value: 'りんご' } })
    fireEvent.click(searchButton)
    
    expect(mockOnSearch).toHaveBeenCalledWith('りんご')
  })

  it('should call onSearch when Enter key is pressed', () => {
    render(<SearchBar onSearch={mockOnSearch} />)
    
    const searchInput = screen.getByPlaceholderText('レシピを検索...')
    
    fireEvent.change(searchInput, { target: { value: 'お好み焼き' } })
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' })
    
    expect(mockOnSearch).toHaveBeenCalledWith('お好み焼き')
  })

  it('should clear search when clear button is clicked', () => {
    render(<SearchBar onSearch={mockOnSearch} />)
    
    const searchInput = screen.getByPlaceholderText('レシピを検索...') as HTMLInputElement
    
    fireEvent.change(searchInput, { target: { value: 'テスト' } })
    expect(searchInput.value).toBe('テスト')
    
    const clearButton = screen.getByRole('button', { name: 'クリア' })
    fireEvent.click(clearButton)
    
    expect(searchInput.value).toBe('')
    expect(mockOnSearch).toHaveBeenCalledWith('')
  })

  it('should not call onSearch with empty string when search button is clicked', () => {
    render(<SearchBar onSearch={mockOnSearch} />)
    
    const searchButton = screen.getByRole('button', { name: '検索' })
    fireEvent.click(searchButton)
    
    expect(mockOnSearch).not.toHaveBeenCalled()
  })
})