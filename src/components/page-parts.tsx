import type { ReactNode } from "react";

export function PageHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="page-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="page-description">{description}</p>
    </div>
  );
}

export function DemoNotice() {
  return <p className="demo-notice" role="note">Ini adalah tampilan contoh. Data belum terhubung ke akun atau database.</p>;
}

export function Card({ title, children, className = "" }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`card ${className}`}>
      {title ? <h2 className="card-title">{title}</h2> : null}
      {children}
    </section>
  );
}

export function EmptyFeature({ title, description, steps }: { title: string; description: string; steps: string[] }) {
  return (
    <Card className="feature-empty">
      <span className="empty-icon" aria-hidden="true">✓</span>
      <h2>{title}</h2>
      <p>{description}</p>
      <div className="feature-steps">
        {steps.map((step, index) => (
          <div className="feature-step" key={step}>
            <span className="step-number">{index + 1}</span>
            <span>{step}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
