import { Button } from '@/components/ui/button'
import { Participant } from '@/generated/prisma/browser'
import { Reimbursement } from '@/lib/balances'
import { Currency } from '@/lib/currency'
import { formatCurrency } from '@/lib/utils'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'

type Props = {
  reimbursements: Reimbursement[]
  participants: Participant[]
  currency: Currency
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
    return <p className="text-sm pb-6">{t('noImbursements')}</p>
  }

  const getParticipant = (id: string) => participants.find((p) => p.id === id)
  return (
    <div className="text-sm">
      {reimbursements.map((reimbursement, index) => (
        <div
          className="py-4 flex justify-between"
          key={index}
          data-testid="reimbursement-row"
          data-from={getParticipant(reimbursement.from)?.name ?? ''}
          data-to={getParticipant(reimbursement.to)?.name ?? ''}
        >
          <div className="flex flex-col gap-1 items-start sm:flex-row sm:items-baseline sm:gap-4">
            <div>
              {t.rich('owes', {
                from: getParticipant(reimbursement.from)?.name ?? '',
                to: getParticipant(reimbursement.to)?.name ?? '',
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
