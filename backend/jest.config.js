/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
  coveragePathIgnorePatterns: [
    "/src/repositories",
    "/src/prisma"
  ]
};