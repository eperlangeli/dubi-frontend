export const confirmScheduledTraining = async ({ date, apiBaseUrl, token, fetcher = fetch }) => {
  const response = await fetcher(`${apiBaseUrl}/api/training/day/confirm`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ day: date, answer: 'yes' }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || 'training_confirmation_failed');
  return payload;
};
