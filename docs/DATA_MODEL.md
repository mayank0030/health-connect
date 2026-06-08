# Data Model Diagram

## Collections (MongoDB)

### Doctor
```
┌─────────────────────────────────────┐
│              Doctor                  │
├─────────────────────────────────────┤
│ _id              ObjectId  (PK)     │
│ name             String             │
│ email            String  (unique)   │
│ password         String  (hashed)   │
│ specialization   String             │
│ consultationFee  Number             │
│ location         String             │
│ about            String             │
│ createdAt        Date               │
│ updatedAt        Date               │
└──────────┬──────────────────────────┘
           │ 1
           │
           │ N
┌──────────▼──────────────────────────┐
│              Slot                    │
├─────────────────────────────────────┤
│ _id              ObjectId  (PK)     │
│ doctorId         ObjectId  (FK)     │
│ date             String  (YYYY-MM-DD)│
│ startTime        String  (HH:mm)    │
│ endTime          String  (HH:mm)    │
│ status           String  [available │
│                   |booked|blocked]  │
│ bookedBy         ObjectId  (FK,     │
│                   nullable)         │
│ bookingId        String  (nullable) │
│ createdAt        Date               │
├─────────────────────────────────────┤
│ Index: (doctorId, date, startTime)  │
│        unique                       │
└─────────────────────────────────────┘
```

### Patient
```
┌─────────────────────────────────────┐
│             Patient                  │
├─────────────────────────────────────┤
│ _id              ObjectId  (PK)     │
│ name             String             │
│ age              Number             │
│ phoneNumber      String             │
│ bloodGroup       String             │
│ medicalConditions String             │
│ currentMedications String           │
│ createdAt        Date               │
│ updatedAt        Date               │
└──────────┬──────────────────────────┘
```

### Booking
```
┌─────────────────────────────────────┐
│             Booking                  │
├─────────────────────────────────────┤
│ _id              ObjectId  (PK)     │
│ bookingId        String  (unique)   │
│ slotId           ObjectId  (FK)     │
│ patientId        ObjectId  (FK)     │
│ doctorId         ObjectId  (FK)     │
│ status           String  [confirmed │
│                   |completed        │
│                   |cancelled]       │
│ diagnosisNotes   String             │
│ prescription     String             │
│ createdAt        Date               │
│ updatedAt        Date               │
└─────────────────────────────────────┘
```

## Relationships

```
Doctor 1 ──── N Slot
Doctor 1 ──── N Booking
Patient 1 ──── N Booking
Slot 1 ──── 1 Booking
```

## Booking Flow (Entity Interaction)

```
Patient selects slot
       │
       ▼
Slot.findOneAndUpdate(                    ◄── Atomic MongoDB operation
  { _id: slotId, status: 'available' },       prevents double-booking
  { $set: { status: 'booked', 
            bookingId: generatedId } }
)
       │
       ├── Success ──► Create Patient (if new)
       │                Create Booking (confirmed)
       │                Return bookingId
       │
       └── Failure ──► Return 409 Conflict
                        Suggest next available slot
```
