import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../auth";
import FoodSearch from "../../../components/FoodSearch";

export default function NutritionFoodCatalog({ day, meal, onAdded }) {
  const { user, admin } = useAuth();
  return (
    <section className="min-w-0 rounded-xl border border-white/10 bg-surface p-3 sm:p-4">
      <h2 className="mb-0 text-xl">Catalog alimente</h2>
      <FoodSearch
        {...{ day, meal, onAdded }}
        renderActions={(food) =>
          food.source !== "openfoodfacts" &&
          (food.user_id === user?.uid || admin) ? (
            <Link
              to={`/nutrition/foods/${food.id}/edit`}
              className="inline-flex min-h-9 items-center rounded-lg border border-white/15 bg-[#203629] px-3 py-1.5 text-sm font-semibold text-copy no-underline hover:bg-[#2d4b39]"
            >
              Editeaza
            </Link>
          ) : null
        }
      />
    </section>
  );
}
