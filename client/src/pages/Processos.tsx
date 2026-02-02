import { useProcessos } from "@/contexts/ProcessosContext";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, MoreHorizontal } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { useState } from "react";

export default function Processos() {
  const { processos, deletarProcesso, isLoading } = useProcessos();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProcessos = processos.filter(p => 
    p.numeroProcesso.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.parteContraria.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "urgente":
        return <Badge className="bg-red-600 hover:bg-red-700 text-white border-none px-3 py-1 rounded-full">Urgente</Badge>;
      case "proximo_vencer":
        return <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-none px-3 py-1 rounded-full">Próximo</Badge>;
      case "ativo":
        return <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white border-none px-3 py-1 rounded-full">Ativo</Badge>;
      default:
        return <Badge variant="secondary" className="px-3 py-1 rounded-full">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">Processos</h1>
            <p className="text-muted-foreground text-lg">Gerencie seus casos e acompanhe prazos com precisão.</p>
          </div>
          <Button className="gap-2 shadow-lg bg-primary hover:bg-primary/90 text-white px-6 py-6 rounded-xl font-bold">
            <Plus className="w-5 h-5" />
            Novo Processo
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 items-center bg-card p-6 rounded-2xl border-2 border-border/50 shadow-sm">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por número, parte ou título..."
              className="pl-12 py-6 bg-secondary/50 border-none rounded-xl focus-visible:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2 py-6 px-6 border-2 border-border hover:bg-secondary rounded-xl font-bold">
            <Filter className="w-5 h-5" />
            Filtros Avançados
          </Button>
        </div>

        {/* Data Table */}
        <div className="rounded-2xl border-2 border-border/50 bg-card shadow-xl overflow-hidden">
          <Table>
            <TableHeader className="bg-secondary/50">
              <TableRow className="border-b-2 border-border/50">
                <TableHead className="font-bold py-6 px-6 text-foreground">Processo / Título</TableHead>
                <TableHead className="font-bold py-6 px-6 text-foreground">Parte Contrária</TableHead>
                <TableHead className="font-bold py-6 px-6 text-foreground">Status</TableHead>
                <TableHead className="font-bold py-6 px-6 text-foreground">Próximo Prazo</TableHead>
                <TableHead className="text-right font-bold py-6 px-6 text-foreground">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-muted-foreground font-medium">Carregando processos...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredProcessos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Search className="w-16 h-16 text-muted-foreground opacity-20" />
                      <p className="text-muted-foreground text-lg font-medium">Nenhum processo encontrado.</p>
                      <Button variant="outline" onClick={() => setSearchTerm("")} className="rounded-xl font-bold border-2">Limpar busca</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProcessos.map((processo) => (
                  <TableRow key={processo.id} className="hover:bg-secondary/30 transition-colors border-b border-border/30">
                    <TableCell className="py-6 px-6">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-lg text-foreground leading-tight">{processo.numeroProcesso}</span>
                        <span className="text-sm text-muted-foreground font-medium">{processo.titulo}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-6 px-6">
                      <span className="font-semibold text-foreground">{processo.parteContraria}</span>
                    </TableCell>
                    <TableCell className="py-6 px-6">
                      {getStatusBadge(processo.status)}
                    </TableCell>
                    <TableCell className="py-6 px-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground">{processo.proximoPrazo || "-"}</span>
                        <span className="text-xs text-muted-foreground font-medium">{processo.descricaoPrazo}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right py-6 px-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-secondary">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl border-2 shadow-2xl p-2 min-w-[160px]">
                          <DropdownMenuLabel className="font-bold text-xs uppercase tracking-wider text-muted-foreground px-3 py-2">Opções</DropdownMenuLabel>
                          <DropdownMenuItem className="rounded-lg font-medium py-2 px-3 cursor-pointer">Ver Detalhes</DropdownMenuItem>
                          <DropdownMenuItem className="rounded-lg font-medium py-2 px-3 cursor-pointer">Editar</DropdownMenuItem>
                          <DropdownMenuSeparator className="my-2 bg-border" />
                          <DropdownMenuItem
                            className="rounded-lg font-bold py-2 px-3 cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
                            onClick={() => deletarProcesso(processo.id)}
                          >
                            Excluir Processo
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
}
