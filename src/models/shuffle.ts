
export class CooldownQueue<T> {
    private pool: T[];
    private history: T[];
    private maxHistorySize: number;

    constructor(pool: T[], cooldownSize: number = 3) {
        this.pool = pool;
        this.history = [];
        // Ensure cooldown size doesn't block the entire pool
        this.maxHistorySize = Math.min(cooldownSize, pool.length - 1);
    }
    public getNext(): T {
        // 1. Filter out items currently in the cooldown history
        const available = this.pool.filter(item => !this.history.includes(item));
        
        // Fallback safety (if pool size is 1)
        const candidates = available.length > 0 ? available : this.pool;

        // 2. Pick a random item from the remaining valid choices
        const randomIndex = Math.floor(Math.random() * candidates.length);
        const selected = candidates[randomIndex];

        // 3. Check to make sure selected isn't undefined before pushing it
        if (selected === undefined) {
            throw new Error("No item found");
        }
        // 4. Add to history and trim the oldest entry if it exceeds max size
        this.history.push(selected);
        if (this.history.length > this.maxHistorySize) {
            this.history.shift(); // Removes the oldest item from the front
        }
        return selected;
    }
}
