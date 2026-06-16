import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateMyProfile } from "../store/profileSlice";

const isPlainObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const isEqualValue = (a, b) => {
  if (Array.isArray(a) && Array.isArray(b)) {
    return (
      a.length === b.length && a.every((item, index) => item === b[index])
    );
  }

  return a === b;
};

const buildChangedPayload = (draft, initialValues) => {
  if (!isPlainObject(draft) || !isPlainObject(initialValues)) {
    return draft;
  }

  return Object.entries(draft).reduce((payload, [key, value]) => {
    if (!isEqualValue(value, initialValues[key])) {
      payload[key] = value;
    }

    return payload;
  }, {});
};

const hasPayloadChanges = (payload) => {
  if (!isPlainObject(payload)) {
    return payload !== undefined && payload !== null;
  }

  return Object.keys(payload).length > 0;
};

export function useEditableSection(initialValues, options = {}) {
  const { buildPayload = buildChangedPayload, onSaved } = options;
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(initialValues);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setDraft(initialValues);
  }, [initialValues]);

  const startEdit = useCallback(() => {
    setError(null);
    setIsEditing(true);
  }, []);

  const cancelEdit = useCallback(() => {
    setDraft(initialValues);
    setError(null);
    setIsEditing(false);
  }, [initialValues]);

  const updateDraft = useCallback((patch) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const save = useCallback(async () => {
    const payload = buildPayload(draft, initialValues);

    if (!hasPayloadChanges(payload)) {
      setError(null);
      setIsEditing(false);
      return null;
    }

    setIsSaving(true);
    setError(null);

    try {
      const updatedProfile = await dispatch(updateMyProfile(payload)).unwrap();
      setIsEditing(false);
      onSaved?.(updatedProfile);
      return updatedProfile;
    } catch (err) {
      const message =
        typeof err === "string"
          ? err
          : err?.message || "Failed to save changes";
      setError(message);
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [buildPayload, dispatch, draft, initialValues, onSaved]);

  return {
    draft,
    updateDraft,
    isEditing,
    startEdit,
    cancelEdit,
    save,
    isSaving,
    error,
  };
}
