// 下書きデータの型定義
export interface DraftData {
  [key: string]: any
}

export interface SavedDraft {
  id: string
  data: DraftData
  savedAt: number
}

const DRAFT_PREFIX = 'ajibaa_draft_'

// 下書きを保存
export function saveDraft(id: string, data: DraftData): void {
  try {
    const draftItem = {
      data,
      savedAt: Date.now()
    }
    
    localStorage.setItem(`${DRAFT_PREFIX}${id}`, JSON.stringify(draftItem))
  } catch (error) {
    console.error('下書きの保存に失敗しました:', error)
  }
}

// 下書きを読み込み
export function loadDraft(id: string): SavedDraft | null {
  try {
    const stored = localStorage.getItem(`${DRAFT_PREFIX}${id}`)
    if (!stored) return null
    
    const parsed = JSON.parse(stored)
    return {
      id,
      data: parsed.data,
      savedAt: parsed.savedAt
    }
  } catch (error) {
    console.error('下書きの読み込みに失敗しました:', error)
    return null
  }
}

// 下書きを削除
export function deleteDraft(id: string): void {
  try {
    localStorage.removeItem(`${DRAFT_PREFIX}${id}`)
  } catch (error) {
    console.error('下書きの削除に失敗しました:', error)
  }
}

// すべての下書きを取得
export function getAllDrafts(): SavedDraft[] {
  try {
    const drafts: SavedDraft[] = []
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(DRAFT_PREFIX)) {
        const id = key.replace(DRAFT_PREFIX, '')
        const draft = loadDraft(id)
        if (draft) {
          drafts.push(draft)
        }
      }
    }
    
    // 保存日時で降順ソート
    return drafts.sort((a, b) => b.savedAt - a.savedAt)
  } catch (error) {
    console.error('下書き一覧の取得に失敗しました:', error)
    return []
  }
}

// 下書きIDを生成
export function generateDraftId(): string {
  return `draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}