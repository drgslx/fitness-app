export const blankProfile = () => ({
  sex: "",
  birth_date: "",
  height_cm: "",
  activity_level: "sedentary",
  goal: "maintain",
  deficit_percent: 10,
  surplus_percent: 10,
  target_weight_kg: "",
  pregnant_or_breastfeeding: false,
  auto_calories: true,
  timezone:
    Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/Bucharest",
});

export function editableProfile(profile) {
  const result = blankProfile();
  for (const key of Object.keys(result))
    if (profile?.[key] !== undefined) result[key] = profile[key] ?? "";
  return result;
}

export function profilePayload(form) {
  return {
    ...form,
    height_cm: Number(form.height_cm),
    target_weight_kg:
      form.target_weight_kg === "" ? null : Number(form.target_weight_kg),
  };
}

// The API is authoritative. This fallback also supports older cached responses.
export function profilePermissions(profile, today, activitySummary) {
  const manualActivityAllowed = activitySummary?.source === "initial_fallback";
  if (!profile)
    return { sex: true, birth_date: true, height_cm: true, activity_level: true, goal: true };
  const [year, month, day] = today.split("-").map(Number);
  const [birthYear, birthMonth, birthDay] = profile.birth_date.split("-").map(Number);
  const birthdayPending = month < birthMonth || (month === birthMonth && day < birthDay);
  const age = year - birthYear - Number(birthdayPending);
  return { sex: false, birth_date: false, height_cm: age < 18, activity_level: manualActivityAllowed, goal: true };
}
