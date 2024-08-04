import { Button } from '@/components/ui/button'
import { Github } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

// FIX for https://github.com/vercel/next.js/issues/58615
// export const dynamic = 'force-dynamic'

export default function HomePage() {
  const t = useTranslations()
  return (
    <main>
      <section className="py-16 md:py-24 lg:py-32">
        <div className="container flex max-w-screen-md flex-col items-center gap-4 text-center">
          <h1 className="!leading-none font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl landing-header py-2">
            {t.rich('Homepage.title', {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Welcome to This Here <strong>Spliit</strong>! <br />
            If you have an idea for how to improve please let me know.
          </p>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/groups">{t('Homepage.button.groups')}</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="https://github.com/spliit-app/spliit">
                <Github className="w-4 h-4 mr-2" />
                OG GitHub
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
