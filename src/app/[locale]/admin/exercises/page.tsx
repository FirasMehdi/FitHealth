"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { PageHeader, Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { localizedField } from "@/lib/utils";

type Exercise = {
  id: string;
  nameEn: string;
  nameFr: string;
  nameAr: string;
  muscleGroup: string;
  descriptionEn?: string | null;
};

export default function AdminExercisesPage() {
  const t = useTranslations("admin");
  const tc = useTranslations("common");
  const locale = useLocale();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    nameEn: "",
    nameFr: "",
    nameAr: "",
    muscleGroup: "",
    descriptionEn: "",
  });

  async function load() {
    const res = await fetch(`/api/exercises?q=${encodeURIComponent(search)}`);
    setExercises(await res.json());
  }

  useEffect(() => {
    load();
  }, [search]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/exercises", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setShowForm(false);
    setForm({ nameEn: "", nameFr: "", nameAr: "", muscleGroup: "", descriptionEn: "" });
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm(t("delete"))) return;
    await fetch(`/api/exercises/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <PageHeader
        title={t("exercises")}
        action={
          <Button onClick={() => setShowForm(!showForm)}>{t("add")}</Button>
        }
      />

      {showForm && (
        <Card className="mb-6">
          <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
            <Input label="Name (EN)" value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} required />
            <Input label="Name (FR)" value={form.nameFr} onChange={(e) => setForm({ ...form, nameFr: e.target.value })} required />
            <Input label="Name (AR)" value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} required />
            <Input label={tc("muscleGroup")} value={form.muscleGroup} onChange={(e) => setForm({ ...form, muscleGroup: e.target.value })} required />
            <div className="sm:col-span-2">
              <Input label={tc("description")} value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} />
            </div>
            <div className="flex gap-2 sm:col-span-2">
              <Button type="submit">{t("save")}</Button>
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>{t("cancel")}</Button>
            </div>
          </form>
        </Card>
      )}

      <Input
        placeholder={t("search")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {exercises.map((ex) => (
          <Card key={ex.id}>
            <h3 className="font-semibold text-stone-900">{localizedField(ex, "name", locale)}</h3>
            <p className="mt-1 text-sm text-stone-500">{ex.muscleGroup}</p>
            <Button variant="ghost" size="sm" className="mt-4 text-red-600" onClick={() => handleDelete(ex.id)}>
              {t("delete")}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
