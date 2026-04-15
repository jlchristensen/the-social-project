interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="relative overflow-hidden border-b border-ember/10 bg-[radial-gradient(ellipse_at_top,_rgba(95,173,128,0.12)_0%,_transparent_55%)] pt-32 pb-16 md:pt-40 md:pb-20">
      <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-brand-50 md:text-5xl">
          {title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-brand-50/70">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
