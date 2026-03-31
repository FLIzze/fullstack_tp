import type { User } from "../types/user";

function formatDate(value: string | undefined) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("fr-FR", { year: "numeric", month: "2-digit", day: "2-digit" });
}

type Props = {
  user: User;
  onDelete: (id: string) => void;
  onEdit?: (user: User) => void;
};

export default function UserCard({ user, onDelete, onEdit }: Props) {
  const role = user?.role ?? "user";
  return (
    <article className="card bg-base-100 shadow-sm border border-base-300/60 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="card-body gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="card-title text-base truncate">{user?.name}</div>
            <div className="text-sm opacity-70 break-words">{user?.email}</div>
          </div>
          <div className={`badge badge-outline ${role === "admin" ? "badge-warning" : "badge-info"}`}>{role}</div>
        </div>

        <div className="text-sm opacity-80">
          <span className="opacity-70">Créé le</span> <span className="font-medium">{formatDate(user?.createdAt)}</span>
        </div>

        <div className="card-actions justify-end">
          <button
            className="btn btn-ghost btn-sm transition-transform duration-150 hover:-translate-y-px"
            onClick={() => onEdit?.(user)}
          >
            Modifier
          </button>
          <button
            className="btn btn-error btn-sm transition-transform duration-150 hover:-translate-y-px"
            onClick={() => onDelete(user._id)}
          >
            Supprimer
          </button>
        </div>
      </div>
    </article>
  );
}

