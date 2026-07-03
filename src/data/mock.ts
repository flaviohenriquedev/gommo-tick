import {
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  FileClock,
  History,
  ListChecks,
  Menu,
  Settings,
  ShieldCheck,
  TimerReset,
  UserRound
} from "lucide-react-native";

export const todaySummary = {
  employeeName: "Flavio",
  greeting: "Bom dia!",
  date: "Quinta-feira, 02 de Julho",
  plannedHours: "08h00",
  workedHours: "06h00",
  progress: 75,
  currentBalance: "+00h15",
  expectedExit: "17:15",
  lastEntry: "Entrada às 08:00"
};

export const menuItems = [
  { label: "Meu Ponto", href: "/my-point", icon: Clock3 },
  { label: "Espelho", href: "/timesheet", icon: FileClock },
  { label: "Solicitações", href: "/requests", icon: ListChecks },
  { label: "Extrato", href: "/hour-balance", icon: TimerReset },
  { label: "Banco", href: "/hour-balance", icon: History },
  { label: "Mais", href: "/more", icon: Menu }
] as const;

export const timeEntries = [
  { label: "Entrada", time: "08:00", tone: "success" },
  { label: "Inicio Almoço", time: "12:00", tone: "warning" },
  { label: "Fim Almoço", time: "13:00", tone: "info" },
  { label: "Saida", time: "17:00", tone: "neutral" }
] as const;

export const mirrorDays = [
  { day: "Seg, 30/06", hours: "08h00", progress: 78, tone: "success" },
  { day: "Sex, 27/06", hours: "08h30", progress: 90, tone: "success" },
  { day: "Qui, 26/06", hours: "07h30", progress: 60, tone: "warning" },
  { day: "Qua, 25/06", hours: "08h00", progress: 80, tone: "success" },
  { day: "Ter, 24/06", hours: "08h00", progress: 78, tone: "success" }
] as const;

export const hourBalanceEntries = [
  { title: "Horas Extras", date: "30/06/2026", value: "+02h00", tone: "success" },
  { title: "Horas Extras", date: "27/06/2026", value: "+01h30", tone: "success" },
  { title: "Atraso", date: "26/06/2026", value: "-00h30", tone: "error" },
  { title: "Falta Justificada", date: "24/06/2026", value: "00h00", tone: "neutral" },
  { title: "Horas Extras", date: "20/06/2026", value: "+02h00", tone: "success" }
] as const;

export const requests = [
  { title: "Ajuste de Ponto", date: "02/07/2026", status: "Pendente", tone: "warning" },
  { title: "Banco de Horas", date: "30/06/2026", status: "Aprovado", tone: "success" },
  { title: "Folga", date: "15/06/2026", status: "Aprovado", tone: "success" },
  { title: "Ajuste de Ponto", date: "10/06/2026", status: "Rejeitado", tone: "error" }
] as const;

export const notifications = [
  {
    title: "Ponto registrado",
    description: "Sua entrada de hoje foi registrada às 08:00.",
    time: "Agora",
    tone: "success"
  },
  {
    title: "Solicitação pendente",
    description: "Seu ajuste de ponto está aguardando aprovação.",
    time: "Hoje",
    tone: "warning"
  },
  {
    title: "Banco de horas atualizado",
    description: "Foram adicionadas 02h00 ao seu saldo.",
    time: "Ontem",
    tone: "info"
  },
  {
    title: "Lembrete",
    description: "Não esqueça de registrar a saída no fim do expediente.",
    time: "30/06",
    tone: "neutral"
  }
] as const;

export const profileItems = [
  { label: "Dados Pessoais", value: "", icon: UserRound },
  { label: "Empresa", value: "Gommo Tecnologia", icon: BriefcaseBusiness },
  { label: "Configurações", value: "", icon: Settings },
  { label: "Segurança", value: "", icon: ShieldCheck },
  { label: "Sobre o App", value: "", icon: Bell }
] as const;

export const settingsItems = [
  { label: "Notificações", value: "", icon: Bell },
  { label: "Ajuda e Suporte", value: "", icon: ShieldCheck },
  { label: "Política de Privacidade", value: "", icon: FileClock },
  { label: "Termos de Uso", value: "", icon: CalendarDays }
] as const;
