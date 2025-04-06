
# Medication Reminder System

## Setup
1. Clone the repo.
2. Install dependencies: `npm install`.
3. Set environment variables in `.env`.
4. Start servers and use Ngrok for webhooks.

## API Endpoints
- POST `/api/calls`: Trigger a call with `{ "phoneNumber": "+1234567890" }`.

## Webhooks
- Configure Twilio to use Ngrok URLs for voice and status callbacks.
