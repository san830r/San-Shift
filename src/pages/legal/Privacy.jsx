import LegalLayout from '../../components/LegalLayout'
import { useContent } from '../../content/ContentContext'

export default function Privacy() {
  const { content } = useContent()
  const page = content.legal.privacy
  const email = content.site.contact.email

  return (
    <LegalLayout title={page.title} updated={page.updated}>
      <p>{page.intro}</p>

      {page.sections.map((section) => (
        <div key={section.heading}>
          <h2 className="font-display text-lg font-bold text-black dark:text-white">{section.heading}</h2>
          <p>{section.body}</p>
        </div>
      ))}

      <div>
        <h2 className="font-display text-lg font-bold text-black dark:text-white">Contact</h2>
        <p>
          For questions about this Privacy Policy, contact us at{' '}
          <a href={`mailto:${email}`} className="font-semibold text-brand-blue">
            {email}
          </a>
          .
        </p>
      </div>
    </LegalLayout>
  )
}
