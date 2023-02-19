export default function Card({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="card">
      <div className="card__header">{title}</div>
      <div className="card__body">
        {children}
      </div>
    </div>
  );
}
