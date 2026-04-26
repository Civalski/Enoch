"use client";

type ProfileDefaults = {
  fullName?: string | null;
  contactEmail?: string | null;
  phone?: string | null;
  address?: string | null;
  cpf?: string | null;
  rg?: string | null;
  description?: string | null;
};

const inputClass =
  "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20";

type Props = {
  idPrefix: string;
  defaults?: ProfileDefaults;
};

/** Campos opcionais: nome, telefone, e-mail de contacto, endereço, CPF, RG, descrição. */
export function UserProfileOptionalFields({ idPrefix, defaults }: Props) {
  const d = defaults ?? {};
  return (
    <div className="space-y-3">
      <div>
        <label htmlFor={`${idPrefix}-fullName`} className="block text-sm font-medium text-slate-700">
          Nome de apresentação <span className="font-normal text-slate-500">(opcional)</span>
        </label>
        <input
          id={`${idPrefix}-fullName`}
          name="fullName"
          type="text"
          defaultValue={d.fullName ?? ""}
          maxLength={200}
          autoComplete="name"
          className={inputClass}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={`${idPrefix}-phone`} className="block text-sm font-medium text-slate-700">
            Telefone <span className="font-normal text-slate-500">(opcional)</span>
          </label>
          <input
            id={`${idPrefix}-phone`}
            name="phone"
            type="tel"
            defaultValue={d.phone ?? ""}
            maxLength={32}
            autoComplete="tel"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor={`${idPrefix}-contactEmail`} className="block text-sm font-medium text-slate-700">
            E-mail de contacto <span className="font-normal text-slate-500">(opcional)</span>
          </label>
          <input
            id={`${idPrefix}-contactEmail`}
            name="contactEmail"
            type="email"
            defaultValue={d.contactEmail ?? ""}
            maxLength={320}
            autoComplete="email"
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label htmlFor={`${idPrefix}-address`} className="block text-sm font-medium text-slate-700">
          Endereço <span className="font-normal text-slate-500">(opcional)</span>
        </label>
        <textarea
          id={`${idPrefix}-address`}
          name="address"
          rows={2}
          defaultValue={d.address ?? ""}
          maxLength={2000}
          className={inputClass}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={`${idPrefix}-cpf`} className="block text-sm font-medium text-slate-700">
            CPF <span className="font-normal text-slate-500">(opcional)</span>
          </label>
          <input
            id={`${idPrefix}-cpf`}
            name="cpf"
            type="text"
            inputMode="numeric"
            defaultValue={d.cpf ?? ""}
            maxLength={14}
            className={inputClass}
            placeholder="11 dígitos"
          />
        </div>
        <div>
          <label htmlFor={`${idPrefix}-rg`} className="block text-sm font-medium text-slate-700">
            RG <span className="font-normal text-slate-500">(opcional)</span>
          </label>
          <input
            id={`${idPrefix}-rg`}
            name="rg"
            type="text"
            defaultValue={d.rg ?? ""}
            maxLength={32}
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label htmlFor={`${idPrefix}-description`} className="block text-sm font-medium text-slate-700">
          Descrição <span className="font-normal text-slate-500">(opcional)</span>
        </label>
        <textarea
          id={`${idPrefix}-description`}
          name="description"
          rows={3}
          defaultValue={d.description ?? ""}
          maxLength={2000}
          className={inputClass}
          placeholder="Notas internas ou descrição do membro"
        />
      </div>
    </div>
  );
}
