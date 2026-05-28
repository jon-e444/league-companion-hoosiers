'use client';
import useSWR from 'swr';
import type { TeamStanding, MatchupPair, SleeperTransaction } from '@/types';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function useLeague() {
  const { data, error, isLoading } = useSWR('/api/league', fetcher, { refreshInterval: 60000 });
  return {
    league: data?.league,
    standings: (data?.standings ?? []) as TeamStanding[],
    currentWeek: (data?.currentWeek ?? 1) as number,
    season: (data?.season ?? '2026') as string,
    isLoading, error: error?.message ?? data?.error,
  };
}

export function useMatchups(week?: number) {
  const url = week ? `/api/matchups?week=${week}` : '/api/matchups';
  const { data, error, isLoading } = useSWR(url, fetcher, { refreshInterval: 30000 });
  return { matchups: (data?.matchups ?? []) as MatchupPair[], week: data?.week as number, isLoading, error: error?.message ?? data?.error };
}

export function useTransactions(week?: number) {
  const url = week ? `/api/transactions?week=${week}` : '/api/transactions';
  const { data, error, isLoading } = useSWR(url, fetcher);
  return { transactions: (data?.transactions ?? []) as SleeperTransaction[], isLoading, error: error?.message ?? data?.error };
}
