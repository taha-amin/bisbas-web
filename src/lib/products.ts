export type SizeId = "10oz" | "16oz";

export type ProductSize = {
  id: SizeId;
  label: string;
  format: "Bottle" | "Jar";
  price: number;
  image: string;
};

export type Product = {
  id: string;
  name: string;
  color: string;
  description: string;
  heat: string;
  image: string;
  pairsWith: string[];
  sizes: ProductSize[];
};

export const products: Product[] = [
  {
    id: "original",
    name: "Original Bisbas Sauce (Bisbas Cagaar)",
    color: "Red",
    description:
      "A family recipe of herbs, garlic, and chilies — Mediterranean brightness with East African soul. Bright, savory, and made to go on everything.",
    heat: "Mild heat",
    image: "/images/red-jar.jpg",
    pairsWith: ["Pasta","Rice", "Bajiya", "Viyazi", "Grilled Chicken", "Beef Suqaar", "Sambusa", "Grilled Fish", "Tacos", "Shawarma"],
    sizes: [
      { id: "10oz", label: "10 oz", format: "Bottle", price: 10, image: "/images/red-bottle.jpg" },
      { id: "16oz", label: "16 oz", format: "Jar", price: 15, image: "/images/red-jar.jpg" },
    ],
  },
  {
    id: "spicy",
    name: "Spicy Bisbas Sauce",
    color: "Green",
    description:
      "The original recipe turned up. Extra chili, the same love. For people who can't get enough heat with their flavor.",
    heat: "Bold heat",
    image: "/images/green-jar.jpg",
    pairsWith: ["Rice", "Pasta", "Viyazi", "Roasted Goat (Hilib Ari)", "Bajiya", "Grilled Chicken", "Beef Suqaar", "Sambusa", "Grilled Fish", "Tacos"],
    sizes: [
      { id: "10oz", label: "10 oz", format: "Bottle", price: 10, image: "/images/green-bottle.jpg" },
      { id: "16oz", label: "16 oz", format: "Jar", price: 15, image: "/images/green-jar.jpg" },
    ],
  },
];

export function getProduct(id: string) {
  return products.find((product) => product.id === id);
}
