"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { PageHeader, Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { localizedField } from "@/lib/utils";

type Ingredient = {
  id: string;
  nameEn: string;
  nameFr: string;
  nameAr: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  unit: string;
};

export default function AdminIngredientsPage() {
  const t = useTranslations("admin");
  const tc = useTranslations("common");
  const locale = useLocale();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    nameEn: "",
    nameFr: "",
    nameAr: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    unit: "g",
  });

  async function load() {
    const res = await fetch(`/api/ingredients?q=${encodeURIComponent(search)}`);
    setIngredients(await res.json());
  }

  useEffect(() => {
    load();
  }, [search]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/ingredients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        calories: parseFloat(form.calories),
        protein: parseFloat(form.protein),
        carbs: parseFloat(form.carbs),
        fat: parseFloat(form.fat),
      }),
    });
    setShowForm(false);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm(t("delete"))) return;
    await fetch(`/api/ingredients/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <PageHeader
        title={t("ingredients")}
        action={<Button onClick={() => setShowForm(!showForm)}>{t("add")}</Button>}
      />

      {showForm && (
        <Card className="mb-6">
          <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-3">
            <Input label="Name (EN)" value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} required />
            <Input label="Name (FR)" value={form.nameFr} onChange={(e) => setForm({ ...form, nameFr: e.target.value })} required />
            <Input label="Name (AR)" value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} required />
            <Input label={tc("calories")} type="number" value={form.calories} onChange={(e) => setForm({ ...form, calories: e.target.value })} required />
            <Input label={tc("protein")} type="number" value={form.protein} onChange={(e) => setForm({ ...form, protein: e.target.value })} required />
            <Input label={tc("carbs")} type="number" value={form.carbs} onChange={(e) => setForm({ ...form, carbs: e.target.value })} required />
            <Input label={tc("fat")} type="number" value={form.fat} onChange={(e) => setForm({ ...form, fat: e.target.value })} required />
            <Input label={tc("unit")} value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} required />
            <div className="flex gap-2 sm:col-span-3">
              <Button type="submit">{t("save")}</Button>
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>{t("cancel")}</Button>
            </div>
          </form>
        </Card>
      )}

      <Input placeholder={t("search")} value={search} onChange={(e) => setSearch(e.target.value)} className="mb-6" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ingredients.map((ing) => (
          <Card key={ing.id}>
            <h3 className="font-semibold text-stone-900">{localizedField(ing, "name", locale)}</h3>
            <p className="mt-2 text-sm text-stone-500">
              {ing.calories} kcal · P {ing.protein}g · C {ing.carbs}g · F {ing.fat}g / {ing.unit}
            </p>
            <Button variant="ghost" size="sm" className="mt-4 text-red-600" onClick={() => handleDelete(ing.id)}>
              {t("delete")}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
