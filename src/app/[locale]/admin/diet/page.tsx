"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { PageHeader, Card } from "@/components/ui/Card";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { localizedField } from "@/lib/utils";

type DietPlan = {
  id: string;
  nameEn: string;
  nameFr: string;
  nameAr: string;
  ingredients: unknown[];
};

type Client = { id: string; fullName: string };

export default function AdminDietPage() {
  const t = useTranslations("admin");
  const locale = useLocale();
  const [plans, setPlans] = useState<DietPlan[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [assignId, setAssignId] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState("");
  const [form, setForm] = useState({ nameEn: "", nameFr: "", nameAr: "", descriptionEn: "" });
  const [showForm, setShowForm] = useState(false);

  async function load() {
    const [d, c] = await Promise.all([
      fetch(`/api/diet-plans?q=${encodeURIComponent(search)}`).then((r) => r.json()),
      fetch("/api/clients").then((r) => r.json()),
    ]);
    setPlans(d);
    setClients(c);
  }

  useEffect(() => {
    load();
  }, [search]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/diet-plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setShowForm(false);
    load();
  }

  async function handleAssign(dietPlanId: string) {
    await fetch("/api/assignments/diet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: selectedClient, dietPlanId }),
    });
    setAssignId(null);
    alert(t("assigned"));
  }

  return (
    <div>
      <PageHeader
        title={t("manageDiet")}
        action={<Button onClick={() => setShowForm(!showForm)}>{t("add")}</Button>}
      />

      {showForm && (
        <Card className="mb-6">
          <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
            <Input label="Name (EN)" value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} required />
            <Input label="Name (FR)" value={form.nameFr} onChange={(e) => setForm({ ...form, nameFr: e.target.value })} required />
            <Input label="Name (AR)" value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} required />
            <Input label="Description" value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} />
            <div className="flex gap-2 sm:col-span-2">
              <Button type="submit">{t("save")}</Button>
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>{t("cancel")}</Button>
            </div>
          </form>
        </Card>
      )}

      <Input placeholder={t("search")} value={search} onChange={(e) => setSearch(e.target.value)} className="mb-6" />

      <div className="space-y-4">
        {plans.map((plan) => (
          <Card key={plan.id}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-stone-900">{localizedField(plan, "name", locale)}</h3>
                <p className="mt-1 text-sm text-stone-500">{plan.ingredients.length} ingredients</p>
              </div>
              <Button size="sm" variant="secondary" onClick={() => setAssignId(plan.id)}>
                {t("assign")}
              </Button>
            </div>
            {assignId === plan.id && (
              <div className="mt-4 flex flex-wrap items-end gap-3 border-t border-stone-100 pt-4">
                <Select label={t("selectClient")} value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)}>
                  <option value="">{t("selectClient")}</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.fullName}</option>
                  ))}
                </Select>
                <Button size="sm" onClick={() => handleAssign(plan.id)} disabled={!selectedClient}>
                  {t("assign")}
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
