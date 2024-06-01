import { Button } from '@/components/ui/button'
import { Reimbursement } from '@/lib/balances'
import { formatCurrency,formatCurrencyNumber } from '@/lib/utils'
import { Participant } from '@prisma/client'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'

type Props = {
  reimbursements: Reimbursement[]
  participants: Participant[]
  currency: string
  groupId: string
  groupName: string
}

export function VenmoRequest({ 
  reimbursement,
  participants,
  groupName,
}: {
  reimbursement: Reimbursement
  participants: Participant[]
  groupName: string
}){
  const getParticipant = (id: string) => participants.find((p) => p.id === id)
  if(getParticipant(reimbursement.from)?.venmo){
    return(
      <Button variant="link" asChild className="-mx-4 -my-3">
        <Link
          href={`https://venmo.com/?txn=charge&audience=private&recipients=${getParticipant(reimbursement.from)?.venmo}&amount=${formatCurrencyNumber(reimbursement.amount)}&note=${encodeURI(groupName)}%20Reimbursement`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div>
            Request payment from {' '} 
            <strong>{ getParticipant(reimbursement.from)?.name}</strong>
          </div>
          </Link>
      </Button>
    )
  }
  return null;
}

export function VenmoPayment({ 
  reimbursement,
  participants,
  groupName,
}: {
  reimbursement: Reimbursement
  participants: Participant[]
  groupName: string
}){
  const getParticipant = (id: string) => participants.find((p) => p.id === id)
  if(getParticipant(reimbursement.to)?.venmo){
    return(
      <Button variant="link" asChild className="-mx-4 -my-3">
        <Link
          href={`https://venmo.com/?txn=pay&audience=private&recipients=${getParticipant(reimbursement.to)?.venmo}&amount=${formatCurrencyNumber(reimbursement.amount)}&note=${encodeURI(groupName)}%20Reimbursement`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div>
            Pay {' '} 
            <strong>{ getParticipant(reimbursement.to)?.name}</strong>
          </div>
          </Link>
      </Button>
    )
  }
  return null;
}

export function ReimbursementList({
  reimbursements,
  participants,
  currency,
  groupId,
  groupName,
}: Props) {
  const locale = useLocale()
  const t = useTranslations('Balances.Reimbursements')
  if (reimbursements.length === 0) {
    return <p className="px-6 text-sm pb-6">{t('noImbursements')}</p>
  }

  const getParticipant = (id: string) => participants.find((p) => p.id === id)
  return (
    <div className="text-sm">
      {reimbursements.map((reimbursement, index) => (
        <div className="border-t px-6 py-4 flex justify-between" key={index}>
          <div className="flex flex-col gap-1 items-start sm:flex-row sm:items-baseline sm:gap-4">
            <div>
              {t.rich('owes', {
                from: getParticipant(reimbursement.from)?.name,
                to: getParticipant(reimbursement.to)?.name,
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </div>
            <Button variant="link" asChild className="-mx-4 -my-3">
              <Link
                href={`/groups/${groupId}/expenses/create?reimbursement=yes&from=${reimbursement.from}&to=${reimbursement.to}&amount=${reimbursement.amount}`}
              >
                {t('markAsPaid')}
              </Link>
            </Button>
            
            <VenmoPayment
              reimbursement = {reimbursement}
              participants = {participants}
              groupName = {groupName}
            />
            
            <VenmoRequest
              reimbursement = {reimbursement}
              participants = {participants}
              groupName = {groupName}
            />

          </div>
          <div>{formatCurrency(currency, reimbursement.amount, locale)}</div>
        </div>
      ))}
    </div>
  )
}
