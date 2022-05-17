module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverage: true,
  setTimeout: 5000000,
  setupFilesAfterEnv: ["./jest.setup.js"],

  runFirstly: ["routes.test.ts"],
};
