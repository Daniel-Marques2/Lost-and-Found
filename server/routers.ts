import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { createLostItem, getLostItemById, listItemsByAuthor, listLostItems, updateItemStatus, updateUserProfile } from "./db";

const itemFilters = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  building: z.string().optional(),
  kind: z.enum(["lost", "found"]).optional(),
  status: z.enum(["open", "returned"]).optional(),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  items: router({
    list: publicProcedure.input(itemFilters.optional()).query(({ input }) => listLostItems(input ?? {})),
    byId: publicProcedure.input(z.object({ id: z.number().int().positive() })).query(async ({ input }) => {
      const item = await getLostItemById(input.id);
      if (!item) throw new TRPCError({ code: "NOT_FOUND", message: "Item não encontrado" });
      return item;
    }),
    mine: protectedProcedure.query(({ ctx }) => listItemsByAuthor(ctx.user.id)),
    create: protectedProcedure
      .input(z.object({
        title: z.string().min(3).max(160),
        description: z.string().min(10).max(5000),
        category: z.string().min(2).max(48),
        kind: z.enum(["lost", "found"]),
        building: z.string().min(1).max(64),
        floor: z.string().min(1).max(32),
        room: z.string().min(1).max(32),
        occurredAt: z.string().min(1),
        images: z.array(z.string()).max(4).optional(),
        contactNote: z.string().max(240).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const id = await createLostItem({
          authorId: ctx.user.id,
          title: input.title,
          description: input.description,
          category: input.category,
          kind: input.kind,
          building: input.building,
          floor: input.floor,
          room: input.room,
          occurredAt: new Date(`${input.occurredAt}T12:00:00`),
          images: JSON.stringify(input.images ?? []),
          contactNote: input.contactNote ?? null,
        });
        return { id };
      }),
    updateStatus: protectedProcedure
      .input(z.object({ id: z.number().int().positive(), status: z.enum(["open", "returned"]) }))
      .mutation(async ({ input, ctx }) => {
        await updateItemStatus(input.id, ctx.user.id, input.status);
        return { success: true } as const;
      }),
  }),
  profile: router({
    update: protectedProcedure.input(z.object({ name: z.string().min(2).max(120) })).mutation(async ({ input, ctx }) => {
      await updateUserProfile(ctx.user.id, input.name);
      return { success: true } as const;
    }),
  }),
});

export type AppRouter = typeof appRouter;
