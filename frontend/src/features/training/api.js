import { api, send } from "../../api/client";

export const listSports = () => api("/sport-types");

export const createSport = (values) =>
  send("/sport-types", "POST", values);

export const deleteSport = (id) =>
  send(`/sport-types/${id}`, "DELETE");

export const listExercises = (sportId) =>
  api(`/sport-types/${sportId}/exercises`);

export const createExercise = (sportId, values) =>
  send(`/sport-types/${sportId}/exercises`, "POST", values);

export const deleteExercise = (id) =>
  send(`/exercises/${id}`, "DELETE");