'use client'

import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { UserProfile } from '@/types/user'
import Image from 'next/image'

interface UserProfilePageProps {
  params: { id: string }
}

export default function UserProfilePage({ params }: UserProfilePageProps) {
  const user = useQuery(api.queries.getUserProfile, { userId: params.id }) as UserProfile | null | undefined

  if (user === null) {
    return (
      <div className="min-h-screen bg-wa-cream flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-wa-charcoal">プロフィールを読み込み中...</p>
        </div>
      </div>
    )
  }

  if (user === undefined) {
    return (
      <div className="min-h-screen bg-wa-cream flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-wa-charcoal mb-4">ユーザーが見つかりません</p>
          <a href="/" className="text-wa-orange hover:underline">
            ホームに戻る
          </a>
        </div>
      </div>
    )
  }

  const joinDate = new Date(user.joinedAt).toLocaleDateString('ja-JP')

  return (
    <div className="min-h-screen bg-wa-cream">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* ヘッダー */}
        <div className="mb-8">
          <a href="/" className="text-wa-orange hover:underline mb-4 inline-block">
            ← ホームに戻る
          </a>
        </div>

        {/* プロフィール情報 */}
        <div className="bg-white rounded-lg p-8 wa-border mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* アバター */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-wa-orange/20 rounded-full flex items-center justify-center">
                {user.avatar ? (
                  <Image 
                    src={user.avatar} 
                    alt={user.name}
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-3xl text-wa-orange">👤</span>
                )}
              </div>
            </div>

            {/* ユーザー情報 */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-wa-charcoal mb-2">
                    {user.name}
                  </h1>
                  
                  {user.prefecture && (
                    <p className="text-wa-charcoal/70 mb-2">
                      📍 {user.prefecture}
                    </p>
                  )}
                  
                  {user.favoriteCategory && (
                    <p className="text-wa-charcoal/70 mb-2">
                      ❤️ 好きなカテゴリ: {user.favoriteCategory}
                    </p>
                  )}
                </div>

                {/* フォローボタン */}
                <button className="px-6 py-2 bg-wa-orange text-white rounded-lg hover:bg-wa-orange/80 transition-colors mt-4 md:mt-0">
                  フォロー
                </button>
              </div>

              {/* 自己紹介 */}
              {user.bio && (
                <div className="mb-4">
                  <p className="text-wa-charcoal leading-relaxed">
                    {user.bio}
                  </p>
                </div>
              )}

              {/* 統計情報 */}
              <div className="flex gap-6 text-sm">
                <div className="text-center">
                  <div className="font-bold text-xl text-wa-charcoal">{user.recipeCount}</div>
                  <div className="text-wa-charcoal/70">レシピ</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-xl text-wa-charcoal">{user.followerCount}</div>
                  <div className="text-wa-charcoal/70">フォロワー</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-xl text-wa-charcoal">{user.followingCount}</div>
                  <div className="text-wa-charcoal/70">フォロー中</div>
                </div>
              </div>

              {/* 参加日 */}
              <div className="mt-4 text-sm text-wa-charcoal/70">
                参加日: {joinDate}
              </div>
            </div>
          </div>
        </div>

        {/* 投稿したレシピ */}
        <div className="bg-white rounded-lg p-6 wa-border">
          <h2 className="text-2xl font-semibold text-wa-charcoal mb-6">
            投稿したレシピ
          </h2>
          
          {user.recipes && user.recipes.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {user.recipes.slice(0, 6).map((recipeId, index) => (
                <div key={recipeId} className="bg-gray-100 p-4 rounded-lg">
                  <div className="text-wa-charcoal">
                    レシピ #{index + 1}
                  </div>
                  <div className="text-sm text-wa-charcoal/70 mt-1">
                    ID: {recipeId}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              まだレシピが投稿されていません
            </p>
          )}
          
          {user.recipes && user.recipes.length > 6 && (
            <div className="text-center mt-6">
              <button className="text-wa-orange hover:underline">
                すべてのレシピを見る
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}