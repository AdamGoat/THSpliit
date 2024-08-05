import { getGroup, getGroupExpenses } from '@/lib/api'
import { useActiveUser } from '@/lib/hooks'
import { Participant } from '@prisma/client'
import { cn, formatCurrency } from '@/lib/utils'
import { 
    getTotalActiveUserPaidFor, 
    getTotalActiveUserShare, 
    getTotalReimbursed, 
    getTotalUserPaidFor
} from '@/lib/totals'
import {
    getBalances,
    getPublicBalances,
    getSuggestedReimbursements,
  } from '@/lib/balances'
import React from 'react'

type Props = {
    group: NonNullable<Awaited<ReturnType<typeof getGroup>>>
    expenses: NonNullable<Awaited<ReturnType<typeof getGroupExpenses>>>
}

interface ParticipantRecord {
    spend: number;
    share: number;
    balance: number;
    reimbursed: number;
}

export function DetailGrid({
    group,
    expenses,
}: Props) {
    const detailMap: Map<string, ParticipantRecord> = new Map();

    const balances = getBalances(expenses)

    group.participants.forEach((participant) => {
        detailMap.set(participant.name, {
            spend: getTotalUserPaidFor(participant.id,expenses), 
            share: getTotalActiveUserShare(participant.id,expenses),
            balance: balances[participant.id]?.total ?? 0,
            reimbursed: getTotalReimbursed(participant.id,expenses)
        })
    })

    const tableStyle: React.CSSProperties = {
        border: '1px solid white',
        borderCollapse: 'collapse',
        width: '100%',
        textAlign: 'center',
    };

    const rowStyle: React.CSSProperties = {
      borderBlock: '1px solid white',
    }

    return (
        <div>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th>Participant</th>
              <th>Total Paid</th>
              <th>-</th>
              <th>Total Share</th>
              <th>-</th>
              <th>Total Reimbursed</th>
              <th>=</th>
              <th>Balance Owed</th>
            </tr>
          </thead>
          <tbody>
            {group.participants.map((participant, index) => (
              <tr style={rowStyle} key={index}>
                <td>{participant.name}</td>
                <td>{formatCurrency(group.currency,detailMap.get(participant.name)?.spend ?? 0,"en-US")}</td>
                <td>-</td>
                <td>{formatCurrency(group.currency,detailMap.get(participant.name)?.share ?? 0,"en-US")}</td>
                <td>-</td>
                <td>{formatCurrency(group.currency,detailMap.get(participant.name)?.reimbursed ?? 0,"en-US")}</td>
                <td>=</td>
                <td>{formatCurrency(group.currency,detailMap.get(participant.name)?.balance ?? 0,"en-US")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )

}