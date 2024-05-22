import { createBrowserClient } from '@supabase/ssr';
import { Database } from 'database.types';

export default ({
	request,
	response,
}: {
	request: Request;
	response: Response;
}) =>
	createBrowserClient<Database>(
		process.env.SUPABASE_URL!,
		process.env.SUPABASE_ANON_KEY!,
	);
