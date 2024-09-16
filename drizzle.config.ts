export default {
  driver: "expo", // <--- very important
  dialect: "sqlite",
  schema: "./data/schema.ts",
  out: "./drizzle",
};
