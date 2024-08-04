import { TotalsPageClient } from '@/app/groups/[groupId]/stats/page.client'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { DetailGrid } from './details-grid'

export async function generateMetadata() {
  const t = await getTranslations('Stats')

  const expenses = await getGroupExpenses(groupId)
  const totalGroupSpendings = getTotalGroupSpending(expenses)

  return (
    <>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>{t('Totals.title')}</CardTitle>
          <CardDescription>{t('Totals.description')}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <Totals
            group={group}
            expenses={expenses}
            totalGroupSpendings={totalGroupSpendings}
          />
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Summary</CardTitle>
          <CardDescription>
            Grid showing expense/reimbursement summary. Balanced owed is the amount owed to you (negative represents debt).
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <DetailGrid
            group={group}
            expenses={expenses}
          />
        </CardContent>
      </Card>
    </>
  )
}
