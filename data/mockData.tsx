// frontend/src/data/mockData.ts (Example structure)

export interface RegionData {
    id: number;
    name: string;
    score: number;
    events: number; // Must be present
    heatLevel: number; 
}

export const tunisiaRegions: RegionData[] = [
    // Ensure all 24 regions are here with a name that matches the GeoJSON property name
    { id: 1, name: "Tunis", score: 8, events: 16, heatLevel: 4 }, 
    { id: 2, name: "Ariana", score: 5, events: 10, heatLevel: 3 }, 
    { id: 3, name: "Ben Arous", score: 6, events: 12, heatLevel: 3 },
    { id: 4, name: "Manouba", score: 4, events: 8, heatLevel: 2 },
    { id: 5, name: "Nabeul", score: 7, events: 14, heatLevel: 4 },
    { id: 6, name: "Zaghouan", score: 3, events: 6, heatLevel: 2 },
    { id: 7, name: "Bizerte", score: 5, events: 10, heatLevel: 3 },
    { id: 8, name: "Beja", score: 2, events: 4, heatLevel: 1 },
    { id: 9, name: "Jendouba", score: 1, events: 2, heatLevel: 1 },
    { id: 10, name: "Kef", score: 3, events: 6, heatLevel: 2 },
    { id: 11, name: "Siliana", score: 2, events: 4, heatLevel: 1 },
    { id: 12, name: "Sousse", score: 7, events: 14, heatLevel: 4 },
    { id: 13, name: "Monastir", score: 6, events: 12, heatLevel: 3 },
    { id: 14, name: "Mahdia", score: 5, events: 10, heatLevel: 3 },
    { id: 15, name: "Sfax", score: 8, events: 16, heatLevel: 4 },
    { id: 16, name: "Kairouan", score: 4, events: 8, heatLevel: 2 },
    { id: 17, name: "Kasserine", score: 2, events: 4, heatLevel: 1 },
    { id: 18, name: "Sidi Bouzid", score: 3, events: 6, heatLevel: 2 },
    { id: 19, name: "Gafsa", score: 4, events: 8, heatLevel: 2 },
    { id: 20, name: "Tozeur", score: 1, events: 2, heatLevel: 1 },
    { id: 21, name: "Kebili", score: 2, events: 4, heatLevel: 1 },
    { id: 22, name: "Gabes", score: 5, events: 10, heatLevel: 3 },
    { id: 23, name: "Mednine", score: 4, events: 8, heatLevel: 2 },
    { id: 24, name: "Tataouine", score: 1, events: 2, heatLevel: 1 },
];