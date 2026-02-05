import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Processo } from "@/types/supabase-types";

// 1. Definição do Schema - Garantindo que campos opcionais sejam tratados como string para evitar 'undefined'
const formSchema = z.object({
  numeroProcesso: z.string().min(1, "Número do processo é obrigatório"),
  titulo: z.string().min(1, "Título é obrigatório"),
  parteContraria: z.string().default(""),
  juizo: z.string().default(""),
  status: z.enum([
    "ativo",
    "suspenso",
    "arquivado",
    "proximo_vencer",
    "urgente",
    "aguardando",
    "veredicto",
    "concluido",
  ]).default("ativo"),
  proximoPrazo: z.string().default(""),
  descricaoPrazo: z.string().default(""),
  tipoProcesso: z.enum(["civel", "criminal", "trabalhista", "administrativo"]).optional().nullable().transform(val => val ?? undefined),
  valorCausa: z.string().default(""),
  anotacoes: z.string().default(""),
});

// Extração do tipo direto do Zod
export type ProcessoFormValues = z.infer<typeof formSchema>;

interface ProcessoFormProps {
  initialData?: Partial<Processo>;
  onSubmit: (data: ProcessoFormValues) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function ProcessoForm({ initialData, onSubmit, isLoading, onCancel }: ProcessoFormProps) {
  // 2. useForm com tipagem inferida pelo resolver para evitar conflitos de tipos manuais
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numeroProcesso: initialData?.numeroProcesso || "",
      titulo: initialData?.titulo || "",
      parteContraria: initialData?.parteContraria || "",
      juizo: initialData?.juizo || "",
      status: (initialData?.status as any) || "ativo",
      proximoPrazo: initialData?.proximoPrazo 
        ? new Date(initialData.proximoPrazo).toISOString().split('T')[0] 
        : "",
      descricaoPrazo: initialData?.descricaoPrazo || "",
      tipoProcesso: (initialData?.tipoProcesso as any) || undefined,
      valorCausa: initialData?.valorCausa || "",
      anotacoes: initialData?.anotacoes || "",
    },
  });

  const handleLocalSubmit = async (values: ProcessoFormValues) => {
    try {
      await onSubmit(values);
      form.reset();
    } catch (error) {
      console.error("Erro ao submeter:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleLocalSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="numeroProcesso"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número do Processo</FormLabel>
                <FormControl>
                  <Input placeholder="0000000-00.0000.0.00.0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="titulo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título / Cliente</FormLabel>
                <FormControl>
                  <Input placeholder="Ação de Cobrança" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="parteContraria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parte Contrária</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="juizo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Juízo / Vara</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="proximo_vencer">Próximo a Vencer</SelectItem>
                    <SelectItem value="urgente">Urgente</SelectItem>
                    <SelectItem value="aguardando">Aguardando</SelectItem>
                    <SelectItem value="veredicto">Veredicto</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                    <SelectItem value="suspenso">Suspenso</SelectItem>
                    <SelectItem value="arquivado">Arquivado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tipoProcesso"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Processo</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || undefined}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="civel">Cível</SelectItem>
                    <SelectItem value="criminal">Criminal</SelectItem>
                    <SelectItem value="trabalhista">Trabalhista</SelectItem>
                    <SelectItem value="administrativo">Administrativo</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="proximoPrazo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Próximo Prazo</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="valorCausa"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor da Causa</FormLabel>
                <FormControl>
                  <Input placeholder="R$ 0,00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="descricaoPrazo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição do Prazo</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="anotacoes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Anotações</FormLabel>
              <FormControl>
                <Textarea className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar Processo"}
          </Button>
        </div>
      </form>
    </Form>
  );
}