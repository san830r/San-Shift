import LegalLayout from '../../components/LegalLayout'
import { useContent } from '../../content/ContentContext'

export default function Refund() {
  const { content } = useContent()
  const page = content.legal.refund
  const email = content.site.contact.email

  return (
    <LegalLayout title={page.title} updated={page.updated}>
      <p>{page.intro}</p>

      {page.sections.map((section) => (
        <div key={section.heading}>
          <h2 className="font-display text-lg font-bold text-black dark:text-white">{section.heading}</h2>
          <p>
            {section.body}
            {section.heading === 'How to Request a Refund' && (
              <>
                {' '}
                Contact us at{' '}
                <a href={`mailto:${email}`} className="font-semibold text-brand-blue">
                  {email}
                </a>{' '}
                with your order details.
              </>
            )}
          </p>
        </div>
      ))}
    </LegalLayout>
  )
}
