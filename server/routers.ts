import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies.js";
import { systemRouter } from "./_core/systemRouter.js";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc.js";
import { z } from "zod";
import { getNotificationPreferences, upsertNotificationPreferences, getNotificationHistory, getProcessos, getProcessoById, createProcesso, updateProcesso, deleteProcesso } from "./db.js";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  processos: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return getProcessos(ctx.user.id);
    }),
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        return getProcessoById(input.id, ctx.user.id);
      }),
    create: protectedProcedure
      .input(z.object({
        numeroProcesso: z.string(),
        titulo: z.string(),
        parteContraria: z.string(),
        juizo: z.string(),
        dataAbertura: z.string().optional(),
        proximoPrazo: z.string().optional(),
        descricaoPrazo: z.string().optional(),
        status: z.enum(["ativo", "proximo_vencer", "urgente", "aguardando", "veredicto"]).optional(),
        tipoProcesso: z.enum(["cível", "criminal", "trabalhista", "administrativo"]).optional(),
        valorCausa: z.string().optional(),
        anotacoes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return createProcesso({
          ...input,
          userId: ctx.user.id,
          dataAbertura: input.dataAbertura ? new Date(input.dataAbertura) : null,
          proximoPrazo: input.proximoPrazo ? new Date(input.proximoPrazo) : null,
        });
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        numeroProcesso: z.string().optional(),
        titulo: z.string().optional(),
        parteContraria: z.string().optional(),
        juizo: z.string().optional(),
        dataAbertura: z.string().optional(),
        proximoPrazo: z.string().optional(),
        descricaoPrazo: z.string().optional(),
        status: z.enum(["ativo", "proximo_vencer", "urgente", "aguardando", "veredicto"]).optional(),
        tipoProcesso: z.enum(["cível", "criminal", "trabalhista", "administrativo"]).optional(),
        valorCausa: z.string().optional(),
        anotacoes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        return updateProcesso(id, ctx.user.id, {
          ...data,
          dataAbertura: data.dataAbertura ? new Date(data.dataAbertura) : undefined,
          proximoPrazo: data.proximoPrazo ? new Date(data.proximoPrazo) : undefined,
        });
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return deleteProcesso(input.id, ctx.user.id);
      }),
  }),

  notifications: router({
    // Obter preferências de notificações
    getPreferences: protectedProcedure.query(async ({ ctx }) => {
      const prefs = await getNotificationPreferences(ctx.user.id);
      return prefs || {
        userId: ctx.user.id,
        emailNotificationsEnabled: "true",
        notifyVencidos: "true",
        notifyUrgentes: "true",
        notifyProximos: "true",
        diasAntecedencia: 7,
        horarioNotificacao: "09:00",
      };
    }),

    // Atualizar preferências de notificações
    updatePreferences: protectedProcedure
      .input(z.object({
        emailNotificationsEnabled: z.enum(["true", "false"]).optional(),
        notifyVencidos: z.enum(["true", "false"]).optional(),
        notifyUrgentes: z.enum(["true", "false"]).optional(),
        notifyProximos: z.enum(["true", "false"]).optional(),
        diasAntecedencia: z.number().min(1).max(30).optional(),
        horarioNotificacao: z.string().regex(/^\d{2}:\d{2}$/).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const updated = await upsertNotificationPreferences(ctx.user.id, input);
        return updated;
      }),

    // Obter histórico de notificações
    getHistory: protectedProcedure
      .input(z.object({
        limit: z.number().min(1).max(100).default(50),
      }))
      .query(async ({ ctx, input }) => {
        const history = await getNotificationHistory(ctx.user.id, input.limit);
        return history;
      }),

    // Enviar notificação de teste
    sendTestNotification: protectedProcedure
      .mutation(async ({ ctx }) => {
        // Simular envio de e-mail de teste
        console.log(`[Notification] Test email sent to ${ctx.user.email}`);
        return {
          success: true,
          message: `E-mail de teste enviado para ${ctx.user.email}`,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
