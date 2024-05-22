import dayjs, { Dayjs } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

/**
 * Parses the given input via dayjs and returns the relative time string.
 *
 * @export
 * @param {(string | Date)} input The input to parse
 * @return {string} The relative time string
 */
export function toRelativeTimeString(input: string | Date): string {
	return dayjs(input).fromNow();
}

/**
 * Parses the given input via dayjs and adds the local time offset of the client to the UTC timezone.
 *
 * @export
 * @param {(string | Date)} input The input to parse
 * @return {Dayjs} The dayjs object with the updated time
 */
export function toUserDateTime(input: string | Date): Dayjs {
	const clientOffsetToUtcInMinutes = new Date().getTimezoneOffset();

	return dayjs(input).add(clientOffsetToUtcInMinutes * -1, 'minutes');
}

/**
 * Parses the given input via dayjs, adds the local UTC offset and returns the relative time string.
 *
 * @export
 * @param {(string | Date)} input The input to parse
 * @return {string} The relative time string after adding the UTC offset
 */
export function toRelativeUserDateTimeString(input: string | Date): string {
	return toUserDateTime(input).fromNow();
}
