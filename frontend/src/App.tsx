import { useEffect, useMemo, useState } from "react";
import UserForm from "./components/UserForm.tsx";
import UserList from "./components/UserList.tsx";
import { userService } from "./services/userService.ts";
import type { CreateUserDTO, User, UserRole } from "./types/user";
// Tailwind/DaisyUI styles are in index.css

type FilterRole = "all" | UserRole;

function pickMessage(err: unknown): string {
  const e = err as any;
  const apiMsg = e?.response?.data?.message;
  if (typeof apiMsg === "string" && apiMsg.length) return apiMsg;
  if (typeof e?.message === "string" && e.message.length) return e.message;
  return "Erreur inconnue";
}

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filterRole, setFilterRole] = useState<FilterRole>("all");

  const count = useMemo(() => users.length, [users]);
  const displayedUsers = useMemo(() => {
    if (filterRole === "admin") return users.filter((u) => u.role === "admin");
    if (filterRole === "user") return users.filter((u) => u.role === "user");
    return users;
  }, [users, filterRole]);

  async function loadUsers() {
    setLoading(true);
    setError(null);
    try {
      const res = await userService.getAll();
      setUsers(res.data?.data ?? []);
    } catch (err) {
      setError(`Impossible de charger les utilisateurs: ${pickMessage(err)}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (!success) return;
    const t = window.setTimeout(() => setSuccess(null), 2000);
    return () => window.clearTimeout(t);
  }, [success]);

  async function handleCreateOrUpdate(formData: CreateUserDTO) {
    setIsSubmitting(true);
    setFormError(null);
    setSuccess(null);
    try {
      if (selectedUser?._id) {
        const res = await userService.update(selectedUser._id, formData);
        const updated = res.data?.data;
        if (updated) setUsers((prev) => prev.map((u) => (u._id === updated._id ? updated : u)));
        setSelectedUser(null);
        setSuccess("Utilisateur mis à jour !");
      } else {
        const res = await userService.create(formData);
        const newUser = res.data?.data;
        if (newUser) setUsers((prev) => [...prev, newUser]);
        setSuccess("Utilisateur créé !");
      }
    } catch (err) {
      setFormError(pickMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!id) return;
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    try {
      await userService.remove(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      setError(`Suppression impossible: ${pickMessage(err)}`);
    }
  }

  function handleEdit(user: User) {
    if (!user?._id) return;
    setSelectedUser(user);
    setFormError(null);
    setSuccess(null);
  }

  return (
    <div className="min-h-screen app-shell">
      <main className="mx-auto w-full max-w-6xl p-4 md:p-6 space-y-4">
        <section className="card bg-base-100 shadow-sm border border-base-300/60">
          <div className="card-body">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight">Utilisateurs</h1>
                <p className="text-sm opacity-70">CRUD temps réel via l’API.</p>
              </div>
              <div className="stats shadow-sm border border-base-300/60 bg-base-100">
                <div className="stat">
                  <div className="stat-title">Total</div>
                  <div className="stat-value text-primary">{count}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Affichés</div>
                  <div className="stat-value">{displayedUsers.length}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="card bg-base-100 shadow-sm border border-base-300/60">
          <div className="card-body">
            <div className="flex flex-wrap items-center gap-3 md:gap-4">
              <div className="font-semibold">Filtre</div>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`btn btn-sm transition-transform duration-150 hover:-translate-y-px ${filterRole === "all" ? "btn-primary" : "btn-ghost"}`}
                  type="button"
                  onClick={() => setFilterRole("all")}
                >
                  Tous
                </button>
                <button
                  className={`btn btn-sm transition-transform duration-150 hover:-translate-y-px ${filterRole === "admin" ? "btn-primary" : "btn-ghost"}`}
                  type="button"
                  onClick={() => setFilterRole("admin")}
                >
                  Admin
                </button>
                <button
                  className={`btn btn-sm transition-transform duration-150 hover:-translate-y-px ${filterRole === "user" ? "btn-primary" : "btn-ghost"}`}
                  type="button"
                  onClick={() => setFilterRole("user")}
                >
                  User
                </button>
              </div>
            </div>
          </div>
        </section>

        <UserForm
          onSubmit={handleCreateOrUpdate}
          isSubmitting={isSubmitting}
          apiError={formError}
          success={success}
          selectedUser={selectedUser}
          onCancelEdit={() => setSelectedUser(null)}
        />

        <UserList
          users={displayedUsers}
          loading={loading}
          error={error}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </main>
    </div>
  );
}

