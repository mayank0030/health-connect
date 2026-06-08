export function generateBookingId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'BKG-';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateTimeSlots(doctorId, date) {
  const slots = [];
  const startHour = 9;
  const endHour = 17;
  const durationMin = 30;

  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += durationMin) {
      const startTime = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      const endMin = m + durationMin;
      const endH = endMin >= 60 ? h + 1 : h;
      const endM = endMin >= 60 ? endMin - 60 : endMin;
      const endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

      slots.push({
        doctorId,
        date,
        startTime,
        endTime,
        status: 'available',
      });
    }
  }
  return slots;
}

export function getNext7Days() {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}
