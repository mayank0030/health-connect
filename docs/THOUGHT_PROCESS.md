# Thought Process & Technical Decisions

## 1. How Double-Booking Prevention Works

### Core Mechanism: MongoDB Atomic `findOneAndUpdate`

When two patients attempt to book the same slot simultaneously, we rely on MongoDB's document-level atomicity:

```javascript
const slot = await Slot.findOneAndUpdate(
  { _id: slotId, status: 'available' },
  { $set: { status: 'booked', bookingId: generatedBookingId } },
  { new: true }
);
```

**Why this works:**

1. **Atomic operation** — MongoDB guarantees that `findOneAndUpdate` is atomic at the document level. Only one write operation on a given document can succeed at a time. When two concurrent requests hit the same slot document, MongoDB's internal locking ensures only one request's update takes effect.

2. **Conditional update** — The filter `{ status: 'available' }` means the update only succeeds if the slot is still available. If another request already changed the status to 'booked', the second request finds no matching document and returns `null`.

3. **No race window** — Unlike a "read-then-write" pattern (where we check availability then separately update), `findOneAndUpdate` combines the check and update into a single atomic operation. There is no gap between checking and writing where another request could interleave.

### What happens to the rejected patient?

When `findOneAndUpdate` returns `null`, we respond with HTTP 409 (Conflict) and query for the next available slot for the same doctor. The patient is shown a clear message ("This slot was just booked by someone else") along with a link to the next available slot.

### Why not other approaches?

| Approach | Why not chosen |
|----------|---------------|
| Frontend-only check | Cannot prevent concurrent API calls |
| Optimistic locking (version field) | Works but requires retry logic and version management |
| Database transactions | Overkill for MongoDB single-document atomic operations; more complex |
| Queue-based booking | Adds latency and infrastructure complexity |

## 2. One Improvement With More Time

**Real-time availability using WebSockets or Server-Sent Events.** When a slot gets booked by one patient, all other patients viewing that doctor's schedule would see the slot disappear in real-time without refreshing the page. This would improve UX and reduce the chance of patients attempting to book already-taken slots. Implementation would use a WebSocket server (e.g., Socket.io) that broadcasts slot-status changes to all connected clients viewing that doctor's slots.

## 3. One Feature Intentionally Left Out

**Patient authentication / user accounts.** The current system allows booking with just name, age, and phone number — no registration or password required. This was intentional to minimize friction and match the real-world Indian healthcare context where:

- Many patients are not tech-savvy and find login/registration barriers frustrating
- Patients often book for family members (elderly parents, children) using their own phone
- Phone number serves as a natural identifier — repeat patients are recognized by phone number and pre-filled with their health summary

A full auth system would add complexity (password reset, OTP verification, session management) that slows down the core booking flow. With more time, a lightweight OTP-based verification on the phone number would be ideal.
