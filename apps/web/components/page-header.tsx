export function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div>
      <h1 className="text-center font-display text-2xl font-bold leading-[130%] text-navy md:text-4xl min-[1920px]:text-5xl">
        {title}
      </h1>
      <p className="mx-auto mt-2 max-w-2xl text-center font-display text-sm font-medium leading-[140%] text-graphite md:mt-3 md:text-lg min-[1920px]:text-xl">
        {subtitle}
      </p>
    </div>
  );
}
