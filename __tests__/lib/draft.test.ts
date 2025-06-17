import { saveDraft, loadDraft, deleteDraft, getAllDrafts } from '@/lib/draft'

// LocalStorageのモック
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => store[key] = value,
    removeItem: (key: string) => delete store[key],
    clear: () => store = {},
    get length() { return Object.keys(store).length },
    key: (index: number) => Object.keys(store)[index] || null
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('Draft functionality', () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  describe('saveDraft', () => {
    it('should save draft to localStorage', () => {
      const draftData = {
        title: 'テストレシピ',
        description: 'テスト用の説明',
        ingredients: ['材料1', '材料2'],
        steps: ['手順1', '手順2']
      }

      saveDraft('draft-1', draftData)

      const saved = localStorageMock.getItem('ajibaa_draft_draft-1')
      expect(saved).toBeTruthy()
      
      const parsed = JSON.parse(saved!)
      expect(parsed.data).toEqual(draftData)
      expect(parsed.savedAt).toBeTruthy()
    })

    it('should update existing draft', () => {
      const draftData1 = { title: 'タイトル1' }
      const draftData2 = { title: 'タイトル2' }

      saveDraft('draft-1', draftData1)
      saveDraft('draft-1', draftData2)

      const saved = loadDraft('draft-1')
      expect(saved?.data.title).toBe('タイトル2')
    })
  })

  describe('loadDraft', () => {
    it('should load existing draft', () => {
      const draftData = { title: 'テストレシピ' }
      saveDraft('draft-1', draftData)

      const loaded = loadDraft('draft-1')
      expect(loaded).toBeTruthy()
      expect(loaded?.data).toEqual(draftData)
      expect(loaded?.savedAt).toBeTruthy()
    })

    it('should return null for non-existent draft', () => {
      const loaded = loadDraft('non-existent')
      expect(loaded).toBeNull()
    })

    it('should handle corrupted data gracefully', () => {
      localStorageMock.setItem('ajibaa_draft_corrupted', 'invalid-json')
      
      const loaded = loadDraft('corrupted')
      expect(loaded).toBeNull()
    })
  })

  describe('deleteDraft', () => {
    it('should delete existing draft', () => {
      saveDraft('draft-1', { title: 'テスト' })
      expect(loadDraft('draft-1')).toBeTruthy()

      deleteDraft('draft-1')
      expect(loadDraft('draft-1')).toBeNull()
    })

    it('should not throw error for non-existent draft', () => {
      expect(() => deleteDraft('non-existent')).not.toThrow()
    })
  })

  describe('getAllDrafts', () => {
    it('should return all drafts', () => {
      saveDraft('draft-1', { title: 'レシピ1' })
      saveDraft('draft-2', { title: 'レシピ2' })
      
      // 関係ないデータも追加
      localStorageMock.setItem('other_data', 'test')

      const drafts = getAllDrafts()
      expect(drafts).toHaveLength(2)
      expect(drafts.find(d => d.id === 'draft-1')?.data.title).toBe('レシピ1')
      expect(drafts.find(d => d.id === 'draft-2')?.data.title).toBe('レシピ2')
    })

    it('should return empty array when no drafts exist', () => {
      const drafts = getAllDrafts()
      expect(drafts).toEqual([])
    })

    it('should skip corrupted draft data', () => {
      saveDraft('draft-1', { title: 'レシピ1' })
      localStorageMock.setItem('ajibaa_draft_corrupted', 'invalid-json')

      const drafts = getAllDrafts()
      expect(drafts).toHaveLength(1)
      expect(drafts[0].id).toBe('draft-1')
    })
  })
})