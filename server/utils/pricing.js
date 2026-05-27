export function median(values) {
    if (!values.length) return null;

    const sorted = [...values].sort((a, b) => a - b);
    const middleIndex = Math.floor(sorted.length / 2);

    return sorted.length % 2 === 0
        ? (sorted[middleIndex - 1] + sorted[middleIndex]) / 2
        : sorted[middleIndex];
}

export function priceTrend(recentPrices) {
    if (recentPrices.length < 2) {
        return { trend: null, trendPercent: null, lastSale: recentPrices[0] ?? null };
    }

    const [latest, previous] = recentPrices;
    const change = latest - previous;
    const trendPercent =
        previous === 0 ? 0 : Math.round(Math.abs((change / previous) * 100));

    return {
        trend: change >= 0 ? "up" : "down",
        trendPercent,
        lastSale: latest,
        previousSale: previous,
    };
}
