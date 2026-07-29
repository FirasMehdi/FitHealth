import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("admin123", 12);

  const admin = await db.user.upsert({
    where: { email: "zou@fithealth.tn" },
    update: {},
    create: {
      email: "zou@fithealth.tn",
      password,
      role: "ADMIN",
    },
  });

  const exercises = await Promise.all([
    db.exercise.upsert({
      where: { id: "seed-bench-press" },
      update: {},
      create: {
        id: "seed-bench-press",
        nameEn: "Bench Press",
        nameFr: "Développé couché",
        nameAr: "ضغط الصدر",
        muscleGroup: "Chest",
        descriptionEn: "Barbell bench press for chest development",
      },
    }),
    db.exercise.upsert({
      where: { id: "seed-squat" },
      update: {},
      create: {
        id: "seed-squat",
        nameEn: "Barbell Squat",
        nameFr: "Squat barre",
        nameAr: "سكوات بالبار",
        muscleGroup: "Legs",
        descriptionEn: "Compound lower body exercise",
      },
    }),
    db.exercise.upsert({
      where: { id: "seed-deadlift" },
      update: {},
      create: {
        id: "seed-deadlift",
        nameEn: "Deadlift",
        nameFr: "Soulevé de terre",
        nameAr: "رفعة ميتة",
        muscleGroup: "Back",
        descriptionEn: "Full posterior chain development",
      },
    }),
    db.exercise.upsert({
      where: { id: "seed-pull-up" },
      update: {},
      create: {
        id: "seed-pull-up",
        nameEn: "Pull Up",
        nameFr: "Traction",
        nameAr: "عقلة",
        muscleGroup: "Back",
        descriptionEn: "Bodyweight vertical pull",
      },
    }),
  ]);

  const ingredients = await Promise.all([
    db.ingredient.upsert({
      where: { id: "seed-chicken" },
      update: {},
      create: {
        id: "seed-chicken",
        nameEn: "Chicken Breast",
        nameFr: "Blanc de poulet",
        nameAr: "صدر دجاج",
        calories: 165,
        protein: 31,
        carbs: 0,
        fat: 3.6,
        unit: "100g",
      },
    }),
    db.ingredient.upsert({
      where: { id: "seed-rice" },
      update: {},
      create: {
        id: "seed-rice",
        nameEn: "Brown Rice",
        nameFr: "Riz complet",
        nameAr: "أرز بني",
        calories: 112,
        protein: 2.6,
        carbs: 24,
        fat: 0.9,
        unit: "100g",
      },
    }),
    db.ingredient.upsert({
      where: { id: "seed-oats" },
      update: {},
      create: {
        id: "seed-oats",
        nameEn: "Oats",
        nameFr: "Flocons d'avoine",
        nameAr: "شوفان",
        calories: 389,
        protein: 17,
        carbs: 66,
        fat: 7,
        unit: "100g",
      },
    }),
  ]);

  const workout = await db.workoutProgram.upsert({
    where: { id: "seed-strength" },
    update: {},
    create: {
      id: "seed-strength",
      nameEn: "Full Body Strength",
      nameFr: "Force corps entier",
      nameAr: "قوة الجسم الكامل",
      descriptionEn: "A balanced full-body strength program",
      descriptionFr: "Programme de force équilibré pour tout le corps",
      descriptionAr: "برنامج قوة متوازن للجسم كامل",
      exercises: {
        create: [
          { exerciseId: exercises[0].id, sets: 4, reps: "8-10", restSeconds: 90, order: 1 },
          { exerciseId: exercises[1].id, sets: 4, reps: "8-10", restSeconds: 120, order: 2 },
          { exerciseId: exercises[2].id, sets: 3, reps: "6-8", restSeconds: 120, order: 3 },
          { exerciseId: exercises[3].id, sets: 3, reps: "Max", restSeconds: 90, order: 4 },
        ],
      },
    },
  });

  const diet = await db.dietPlan.upsert({
    where: { id: "seed-balanced" },
    update: {},
    create: {
      id: "seed-balanced",
      nameEn: "Balanced Muscle Plan",
      nameFr: "Plan musculaire équilibré",
      nameAr: "خطة عضلية متوازنة",
      descriptionEn: "High protein balanced daily nutrition",
      ingredients: {
        create: [
          { ingredientId: ingredients[2].id, quantity: 1, mealType: "BREAKFAST" },
          { ingredientId: ingredients[0].id, quantity: 1.5, mealType: "LUNCH" },
          { ingredientId: ingredients[1].id, quantity: 1.5, mealType: "LUNCH" },
          { ingredientId: ingredients[0].id, quantity: 1.5, mealType: "DINNER" },
        ],
      },
    },
  });

  console.log("Seed complete:");
  console.log(`  Admin: zou@fithealth.tn / admin123`);
  console.log(`  Exercises: ${exercises.length}`);
  console.log(`  Ingredients: ${ingredients.length}`);
  console.log(`  Workout: ${workout.nameEn}`);
  console.log(`  Diet: ${diet.nameEn}`);
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
