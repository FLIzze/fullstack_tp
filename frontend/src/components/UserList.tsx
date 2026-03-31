import type { User } from "../types/user";
import UserCard from "./UserCard.tsx";

type Props = {
  users: User[];
  loading: boolean;
  error: string | null;
  onDelete: (id: string) => void;
  onEdit: (user: User) => void;
};

export default function UserList({ users, loading, error, onDelete, onEdit }: Props) {
  if (loading)
    return (
      <div className="card bg-base-100 shadow-sm border border-base-300/60">
        <div className="card-body">
          <div className="flex items-center gap-3">
            <span className="loading loading-spinner loading-md" />
            <span>Chargement...</span>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="card bg-base-100 shadow-sm border border-base-300/60">
        <div className="card-body">
          <div className="alert alert-error">{error}</div>
        </div>
      </div>
    );

  if (!users?.length)
    return (
      <div className="card bg-base-100 shadow-sm border border-base-300/60">
        <div className="card-body">
          <div className="alert">
            <span className="font-medium">Aucun utilisateur</span>
            <span className="opacity-70">Ajoute-en un via le formulaire ci-dessus.</span>
          </div>
        </div>
      </div>
    );

  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {users.map((u) => (
        <UserCard key={u._id} user={u} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </section>
  );
}

