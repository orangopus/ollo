import { connect } from 'getstream';

export function getClient() {
  const client = connect(
    process.env.STREAM_API_KEY!,
    process.env.STREAM_API_SECRET!,
    process.env.STREAM_APP_ID!,
  );
  return client;
}
