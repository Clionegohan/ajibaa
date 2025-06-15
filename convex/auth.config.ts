import Google from "@auth/core/providers/google";
import { convexAuth } from "@convex-dev/auth/server";

export default convexAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async createOrUpdateUser(ctx, args) {
      // ユーザーがログインした時の処理
      if (args.existingUserId) {
        // 既存ユーザーの最終ログイン時刻を更新
        await ctx.db.patch(args.existingUserId, {
          lastLoginAt: Date.now(),
        });
        return args.existingUserId;
      }
      
      // 新規ユーザー作成
      const userId = await ctx.db.insert("users", {
        email: args.profile.email!,
        name: args.profile.name || "名無し",
        role: "user",
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        lastLoginAt: Date.now(),
      });
      
      return userId;
    },
  },
});