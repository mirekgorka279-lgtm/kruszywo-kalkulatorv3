class PriceDatabase {

    constructor() {
        this.data = [];
    }

    async load() {

        const response = await fetch(CONFIG.API_URL);

        if (!response.ok) {
            throw new Error("Nie można pobrać cennika.");
        }

        this.data = await response.json();

        localStorage.setItem(
            CONFIG.CACHE_KEY,
            JSON.stringify(this.data)
        );

        localStorage.setItem(
            CONFIG.LAST_SYNC_KEY,
            new Date().toISOString()
        );

        return this.data;
    }

    loadCache() {

        const cache = localStorage.getItem(CONFIG.CACHE_KEY);

        if (!cache) return [];

        this.data = JSON.parse(cache);

        return this.data;
    }

    getQuarries() {

        return [...new Set(
            this.data.map(x => x.kopalnia)
        )].sort();

    }

    getProducts(quarry) {

        return this.data
            .filter(x => x.kopalnia === quarry)
            .map(x => x.produkt)
            .sort();

    }

    getPrice(quarry, product) {

        const row = this.data.find(x =>
            x.kopalnia === quarry &&
            x.produkt === product
        );

        return row ? Number(row.cena) : 0;

    }

}

window.PriceDatabase = new PriceDatabase();
