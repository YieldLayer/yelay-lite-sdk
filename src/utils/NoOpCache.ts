import type { Store } from '@gud/drift';

/**
 * A no-operation cache implementation that implements the Store interface
 * but doesn't actually store any data, effectively disabling caching.
 *
 * This is useful when you want to disable caching in the drift package
 * to ensure fresh data on every request.
 */
export class NoOpCache implements Store {
	/**
	 * Returns an empty iterable since we don't store anything.
	 */
	entries(): Iterable<[string, any]> {
		return [];
	}

	/**
	 * Always returns false since we don't store anything.
	 */
	has(_key: string): boolean {
		return false;
	}

	/**
	 * Always returns undefined since we don't store anything.
	 */
	get(_key: string): undefined {
		return undefined;
	}

	/**
	 * Does nothing - doesn't store the value.
	 */
	set(_key: string, _value: any): void {
		// No-op: don't store anything
	}

	/**
	 * Does nothing - nothing to delete.
	 */
	delete(_key: string): void {
		// No-op: nothing to delete
	}

	/**
	 * Does nothing - nothing to clear.
	 */
	clear(): void {
		// No-op: nothing to clear
	}
}
