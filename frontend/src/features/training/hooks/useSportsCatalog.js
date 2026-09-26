import { useEffect, useRef, useState } from "react";
import * as catalogApi from "../api";

export function useSportsCatalog() {
  const [sports, setSports] = useState([]);
  const [selectedSportId, setSelectedSportId] = useState("");
  const [exercises, setExercises] = useState([]);

  const [loadingSports, setLoadingSports] = useState(true);
  const [loadingExercises, setLoadingExercises] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [exerciseRevision, setExerciseRevision] = useState(0);

  const savingRef = useRef(false);

  const selectedSport = sports.find(
    (sport) => String(sport.id) === selectedSportId
  );

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const data = await catalogApi.listSports();
        if (active) setSports(data);
      } catch (error) {
        if (active) setError(error.message);
      } finally {
        if (active) setLoadingSports(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    setExercises([]);

    if (!selectedSportId) {
      setLoadingExercises(false);
      return;
    }

    setLoadingExercises(true);

    async function load() {
      try {
        const data = await catalogApi.listExercises(selectedSportId);
        if (active) setExercises(data);
      } catch (error) {
        if (active) setError(error.message);
      } finally {
        if (active) setLoadingExercises(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [selectedSportId, exerciseRevision]);

  async function runMutation(operation, successMessage) {
    if (savingRef.current) return false;

    savingRef.current = true;
    setSaving(true);
    setError("");
    setMessage("");

    try {
      await operation();
      setMessage(successMessage);
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }

  function selectSport(id) {
  if (savingRef.current) return;

  const nextSportId = String(id);
  if (nextSportId === selectedSportId) return;

  setError("");
  setMessage("");
  setExercises([]);
  setSelectedSportId(nextSportId);
}

  function addSport(values) {
    return runMutation(async () => {
      const created = await catalogApi.createSport(values);

      setSports((current) =>
        [...current, created].sort((a, b) =>
          a.name.localeCompare(b.name)
        )
      );

      setSelectedSportId(String(created.id));
    }, "Sportul a fost adaugat.");
  }

  function addExercise(values) {
    if (!selectedSport) return Promise.resolve(false);

    const sportId = selectedSport.id;

    return runMutation(async () => {
      await catalogApi.createExercise(sportId, values);
      setExerciseRevision((current) => current + 1);
    }, "Exercitiul a fost adaugat.");
  }

  function archiveSport(sport) {
    if (sport.is_system) return;
    if (!window.confirm(`Arhivezi sportul "${sport.name}"?`)) return;

    return runMutation(async () => {
      await catalogApi.deleteSport(sport.id);

      setSports((current) =>
        current.filter((item) => item.id !== sport.id)
      );

      setSelectedSportId("");
      setExercises([]);
    }, "Sportul a fost arhivat.");
  }

  function archiveExercise(exercise) {
    if (exercise.is_system) return;
    if (!window.confirm(`Arhivezi exercitiul "${exercise.name}"?`)) {
      return;
    }

    return runMutation(async () => {
      await catalogApi.deleteExercise(exercise.id);

      setExercises((current) =>
        current.filter((item) => item.id !== exercise.id)
      );
    }, "Exercitiul a fost arhivat.");
  }

  return {
    sports,
    selectedSport,
    exercises,
    loadingSports,
    loadingExercises,
    saving,
    error,
    message,
    selectSport,
    addSport,
    addExercise,
    archiveSport,
    archiveExercise,
  };
}