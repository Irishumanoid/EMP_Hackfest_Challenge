const names: any = {
    food: "Food",
    groceries: "Groceries",
    gas: "Gas",
    clothes: "Clothes",
    parking: "Parking"
}

export function getTagName(tag: string): string {
    return names[tag] || tag;
}