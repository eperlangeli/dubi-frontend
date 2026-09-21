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

const startMinutes = (value) => {
  const normalized = normalizeWorkoutStartTime(value);
  if (!normalized) return Number.POSITIVE_INFINITY;
  const [hours, minutes] = normalized.split(':').map(Number);
  return hours * 60 + minutes;
};

export const normalizeTrainingSessions = (value = []) => {
  const normalized = (Array.isArray(value) ? value : [])
    .map((session) => ({
      day_of_week: asDay(session?.day_of_week ?? session?.dayOfWeek),
      sport_id: String(session?.sport_id ?? session?.sportId ?? '').trim(),
      start_time: normalizeWorkoutStartTime(session?.start_time ?? session?.startTime),
      duration_min: normalizeWorkoutDuration(session?.duration_min ?? session?.duration_minutes ?? session?.durationMinutes),
      session_index: Number(session?.session_index ?? session?.sessionIndex) || 1,
    }))
    .filter((session) => session.day_of_week)
    .sort((left, right) => (
      left.day_of_week - right.day_of_week
      || startMinutes(left.start_time) - startMinutes(right.start_time)
      || left.session_index - right.session_index
    ));

  const perDayCount = new Map();
  return normalized.map((session) => {
    const nextIndex = (perDayCount.get(session.day_of_week) || 0) + 1;
    perDayCount.set(session.day_of_week, nextIndex);
    return { ...session, session_index: nextIndex };
  });
};

export const isoDayOfWeek = (isoDate) => {
  const parsed = new Date(`${String(isoDate || '').slice(0, 10)}T12:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return null;
  const day = parsed.getUTCDay();
  return day === 0 ? 7 : day;
};

export const getTrainingSessionsForDate = (sessions, isoDate) => {
  const day = isoDayOfWeek(isoDate);
  return normalizeTrainingSessions(sessions).filter((session) => session.day_of_week === day);
};

export const getTrainingSessionForDate = (sessions, isoDate) => (
  getTrainingSessionsForDate(sessions, isoDate)[0] || null
);

export const isTrainingSessionComplete = (session) => Boolean(
  session
  && asDay(session.day_of_week)
  && String(session.sport_id || '').trim()
  && normalizeWorkoutStartTime(session.start_time)
  && normalizeWorkoutDuration(session.duration_min)
);

export const trainingSessionsOverlap = (sessions) => {
  const grouped = new Map();
  normalizeTrainingSessions(sessions).forEach((session) => {
    if (!grouped.has(session.day_of_week)) grouped.set(session.day_of_week, []);
    grouped.get(session.day_of_week).push(session);
  });
  return [...grouped.values()].some((daySessions) => daySessions.some((session, index) => {
    if (index === 0 || !isTrainingSessionComplete(session) || !isTrainingSessionComplete(daySessions[index - 1])) return false;
    const previous = daySessions[index - 1];
    return startMinutes(session.start_time) < startMinutes(previous.start_time) + previous.duration_min;
  }));
};

export const upsertTrainingSession = (sessions, nextSession) => {
  const day = asDay(nextSession?.day_of_week ?? nextSession?.dayOfWeek);
  if (!day) return normalizeTrainingSessions(sessions);
  const sessionIndex = Number(nextSession?.session_index ?? nextSession?.sessionIndex) || 1;
  const existing = normalizeTrainingSessions(sessions).filter((session) => !(
    session.day_of_week === day && session.session_index === sessionIndex
  ));
  return normalizeTrainingSessions([...existing, {
    ...nextSession,
    day_of_week: day,
    session_index: sessionIndex,
  }]);
};

export const removeTrainingSession = (sessions, dayOfWeek, sessionIndex = null) => (
  normalizeTrainingSessions(sessions).filter((session) => (
    session.day_of_week !== asDay(dayOfWeek)
    || (sessionIndex !== null && session.session_index !== Number(sessionIndex))
  ))
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

export const buildTodayWorkoutModel = ({ sessions, isoDate, sportLabels = {}, dailyOverride = null } = {}) => {
  if (dailyOverride?.state === 'rest') {
    return { status: 'rest', sessions: [], session: null, title: 'Oggi non ti alleni', explicit: true };
  }
  const daySessions = dailyOverride?.state === 'training'
    ? normalizeTrainingSessions(dailyOverride.sessions)
    : getTrainingSessionsForDate(sessions, isoDate);
  if (daySessions.length === 0) {
    return { status: 'rest', sessions: [], session: null, title: 'Nessun allenamento programmato', explicit: false };
  }
  if (daySessions.some((session) => !isTrainingSessionComplete(session))) {
    return { status: 'incomplete', sessions: daySessions, session: daySessions[0], title: 'Mancano sport, orario o durata', explicit: Boolean(dailyOverride) };
  }
  if (daySessions.length > 1) {
    return {
      status: 'multiple',
      sessions: daySessions,
      session: daySessions[0],
      title: `${daySessions.length} allenamenti`,
      explicit: Boolean(dailyOverride),
    };
  }
  const session = daySessions[0];
  return {
    status: 'complete',
    sessions: daySessions,
    session,
    title: sportLabels[session.sport_id] || session.sport_id,
    detail: `${session.start_time} · ${session.duration_min} min`,
    explicit: Boolean(dailyOverride),
  };
};
