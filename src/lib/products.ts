export type SizeId = "10oz" | "16oz";

export type ProductSize = {
  id: SizeId;
  label: string;
  price: number;
  image: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  heat: string;
  image: string;
  pairsWith: string[];
  sizes: ProductSize[];
};

export const products: Product[] = [
  {
    id: "original",
    name: "Original Bisbas Sauce",
    description:
      "A family recipe of herbs, garlic, and chilies — Mediterranean brightness with East African soul. Bright, savory, and made to go on everything.",
    heat: "Mild heat",
    image: "/images/jars.jpg",
    pairsWith: ["Shakshuka", "Eggs", "Rice bowls", "Grilled fish", "Roasted veg"],
    sizes: [
      { id: "10oz", label: "10 oz", price: 10, image: "/images/bottles.jpg" },
      { id: "16oz", label: "16 oz", price: 15, image: "/images/jars.jpg" },
    ],
  },
  {
    id: "spicy",
    name: "Spicy Bisbas Sauce",
    description:
      "The original recipe turned up. Extra chili, the same love. For people who can't get enough heat with their flavor.",
    heat: "Bold heat",
    image: "/images/jars.jpg",
    pairsWith: ["Tacos", "Grilled chicken", "Wings", "Pizza", "Chili"],
    sizes: [
      { id: "10oz", label: "10 oz", price: 10, image: "/images/bottles.jpg" },
      { id: "16oz", label: "16 oz", price: 15, image: "/images/jars.jpg" },
    ],
  },
];

export function getProduct(id: string) {
  return products.find((product) => product.id === id);
}
