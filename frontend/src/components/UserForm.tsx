import { useEffect, useMemo, useState } from "react";
import type { CreateUserDTO, User, UserRole } from "../types/user";

type Props = {
  onSubmit: (data: CreateUserDTO) => Promise<void> | void;
  isSubmitting?: boolean;
  apiError?: string | null;
  success?: string | null;
  selectedUser?: User | null;
  onCancelEdit?: () => void;
};

export default function UserForm({
  onSubmit,
  isSubmitting = false,
  apiError = null,
  success = null,
  selectedUser = null,
  onCancelEdit,
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("user");
  const [validationError, setValidationError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return name.trim().length > 0 && email.trim().length > 0 && !isSubmitting;
  }, [name, email, isSubmitting]);

  useEffect(() => {
    if (success) {
      setName("");
      setEmail("");
      setRole("user");
      setValidationError(null);
    }
  }, [success]);

  useEffect(() => {
    if (!selectedUser) return;
    setName(selectedUser?.name ?? "");
    setEmail(selectedUser?.email ?? "");
    setRole(selectedUser?.role ?? "user");
    setValidationError(null);
  }, [selectedUser]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const n = name.trim();
    const em = email.trim();

    if (!n || !em) {
      setValidationError("Merci de renseigner le nom et l'email.");
      return;
    }

    setValidationError(null);
    await onSubmit({ name: n, email: em, role });
  }

  return (
    <section className="card bg-base-100 shadow-sm border border-base-300/60">
      <div className="card-body">
        <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
          <h2 className="card-title tracking-tight">
            {selectedUser ? "Modifier un utilisateur" : "Ajouter un utilisateur"}
          </h2>
          <div className="text-xs opacity-70">
            Les champs <span className="font-medium">Nom</span> et <span className="font-medium">Email</span> sont requis.
          </div>
        </div>

        {validationError ? <div className="alert alert-error">{validationError}</div> : null}
        {apiError ? <div className="alert alert-error">{apiError}</div> : null}
        {success ? <div className="alert alert-success">{success}</div> : null}

        <form className="grid gap-3 md:grid-cols-2" onSubmit={handleSubmit}>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Nom</span>
            </div>
            <input
              className="input input-bordered w-full"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alice Martin"
              autoComplete="name"
            />
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Email</span>
            </div>
            <input
              className="input input-bordered w-full"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alice@example.com"
              autoComplete="email"
            />
          </label>

          <label className="form-control w-full md:col-span-2">
            <div className="label">
              <span className="label-text">Rôle</span>
            </div>
            <select
              className="select select-bordered w-full"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </label>

          <div className="mt-2 flex justify-end gap-2 md:col-span-2">
            {selectedUser ? (
              <button
                className="btn btn-ghost transition-transform duration-150 hover:-translate-y-px"
                type="button"
                onClick={onCancelEdit}
                disabled={isSubmitting}
              >
                Annuler
              </button>
            ) : null}
            <button
              className="btn btn-primary transition-transform duration-150 hover:-translate-y-px"
              type="submit"
              disabled={!canSubmit}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm" /> Envoi...
                </>
              ) : selectedUser ? (
                "Mettre à jour"
              ) : (
                "Créer"
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

