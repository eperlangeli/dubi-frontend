const DAY_MIN = 1;
const DAY_MAX = 7;

const asDay = (value) => {
  const day = Number(value);
  return Number.isInteger(day) && day >= DAY_MIN && day <= DAY_MAX ? day : null;
};

export const normalizeWorkoutStartTime = (value) => {
  const match = String(value || '').trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return '';
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return '';
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};

export const normalizeWorkoutDuration = (value) => {
  const duration = Number(value);
  return Number.isFinite(duration) && duration > 0 ? Math.round(duration) : null;
};

export const normalizeTrainingSessions = (value = []) => {
  const seen = new Set();
  return (Array.isArray(value) ? value : [])
    .map((session) => ({
      day_of_week: asDay(session?.day_of_week ?? session?.dayOfWeek),
      sport_id: String(session?.sport_id ?? session?.sportId ?? '').trim(),
      start_time: normalizeWorkoutStartTime(session?.start_time ?? session?.startTime),
      duration_min: normalizeWorkoutDuration(session?.duration_min ?? session?.duration_minutes ?? session?.durationMinutes),
      session_index: Number(session?.session_index ?? session?.sessionIndex) || 1,
    }))
    .filter((session) => {
      if (!session.day_of_week || session.session_index !== 1 || seen.has(session.day_of_week)) return false;
      seen.add(session.day_of_week);
      return true;
    })
    .sort((a, b) => a.day_of_week - b.day_of_week);
};

export const isoDayOfWeek = (isoDate) => {
  const parsed = new Date(`${String(isoDate || '').slice(0, 10)}T12:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return null;
  const day = parsed.getUTCDay();
  return day === 0 ? 7 : day;
};

export const getTrainingSessionForDate = (sessions, isoDate) => {
  const day = isoDayOfWeek(isoDate);
  return normalizeTrainingSessions(sessions).find((session) => session.day_of_week === day) || null;
};

export const isTrainingSessionComplete = (session) => Boolean(
  session
  && asDay(session.day_of_week)
  && String(session.sport_id || '').trim()
  && normalizeWorkoutStartTime(session.start_time)
  && normalizeWorkoutDuration(session.duration_min)
);

export const upsertTrainingSession = (sessions, nextSession) => {
  const day = asDay(nextSession?.day_of_week ?? nextSession?.dayOfWeek);
  if (!day) return normalizeTrainingSessions(sessions);
  const existing = normalizeTrainingSessions(sessions).filter((session) => session.day_of_week !== day);
  return normalizeTrainingSessions([...existing, {
    ...nextSession,
    day_of_week: day,
    session_index: 1,
  }]);
};

export const removeTrainingSession = (sessions, dayOfWeek) => (
  normalizeTrainingSessions(sessions).filter((session) => session.day_of_week !== asDay(dayOfWeek))
);

export const workoutScheduleSignature = (sessions) => JSON.stringify(
  normalizeTrainingSessions(sessions).map((session) => [
    session.day_of_week,
    session.sport_id,
    session.start_time,
    session.duration_min,
    session.session_index,
  ])
);

export const buildTodayWorkoutModel = ({ sessions, isoDate, sportLabels = {} } = {}) => {
  const session = getTrainingSessionForDate(sessions, isoDate);
  if (!session) return { status: 'rest', session: null, title: 'Nessun allenamento programmato' };
  if (!isTrainingSessionComplete(session)) {
    return { status: 'incomplete', session, title: 'Mancano orario o durata' };
  }
  return {
    status: 'complete',
    session,
    title: sportLabels[session.sport_id] || session.sport_id,
    detail: `${session.start_time} · ${session.duration_min} min`,
  };
};
