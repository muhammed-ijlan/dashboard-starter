import { describe, it, expect } from "vitest";
import { adminModalSchemas, roleDrawerSchemas, dappDrawerSchemas } from "./index";

const adminMsgs = {
  accountRequired: "Account required",
  nameRequired: "Name required",
  emailRequired: "Email required",
  emailInvalid: "Invalid email",
  roleRequired: "Role required",
  passwordRequired: "Password required",
  confirmRequired: "Confirm required",
};

describe("adminModalSchemas", () => {
  const schemas = adminModalSchemas(adminMsgs);

  it("validates account is required", () => {
    expect(schemas.account.safeParse("").success).toBe(false);
    expect(schemas.account.safeParse("admin").success).toBe(true);
  });

  it("validates name is required", () => {
    expect(schemas.name.safeParse("").success).toBe(false);
    expect(schemas.name.safeParse("John").success).toBe(true);
  });

  it("validates email is required and well-formed", () => {
    expect(schemas.email.safeParse("").success).toBe(false);
    expect(schemas.email.safeParse("not-email").success).toBe(false);
    expect(schemas.email.safeParse("user@test.com").success).toBe(true);
  });

  it("returns correct error message for invalid email", () => {
    const result = schemas.email.safeParse("not-email");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Invalid email");
    }
  });

  it("validates role is required", () => {
    expect(schemas.role.safeParse("").success).toBe(false);
    expect(schemas.role.safeParse("Admin").success).toBe(true);
  });

  it("validates password is required", () => {
    expect(schemas.password.safeParse("").success).toBe(false);
    expect(schemas.password.safeParse("pass123").success).toBe(true);
  });

  it("validates confirm is required", () => {
    expect(schemas.confirm.safeParse("").success).toBe(false);
    expect(schemas.confirm.safeParse("pass123").success).toBe(true);
  });
});

describe("roleDrawerSchemas", () => {
  const schemas = roleDrawerSchemas({
    nameRequired: "Name required",
    descriptionRequired: "Description required",
  });

  it("validates name is required", () => {
    expect(schemas.name.safeParse("").success).toBe(false);
    expect(schemas.name.safeParse("Editor").success).toBe(true);
  });

  it("validates description is required", () => {
    expect(schemas.description.safeParse("").success).toBe(false);
    expect(schemas.description.safeParse("Can edit stuff").success).toBe(true);
  });
});

describe("dappDrawerSchemas", () => {
  const schemas = dappDrawerSchemas({
    nameRequired: "Name required",
    categoryRequired: "Category required",
    urlRequired: "URL required",
    urlInvalid: "Enter a valid URL",
    iconInvalid: "Enter a valid logo URL",
  });

  it("validates name is required", () => {
    expect(schemas.name.safeParse("").success).toBe(false);
    expect(schemas.name.safeParse("Uniswap").success).toBe(true);
  });

  it("validates category (typeId) is required", () => {
    expect(schemas.typeId.safeParse(undefined).success).toBe(false);
    expect(schemas.typeId.safeParse(116).success).toBe(true);
  });

  it("returns correct error message for missing category", () => {
    const result = schemas.typeId.safeParse(undefined);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Category required");
    }
  });

  it("validates url is required", () => {
    expect(schemas.url.safeParse("").success).toBe(false);
  });

  it("validates url must be a valid URL", () => {
    expect(schemas.url.safeParse("not-a-url").success).toBe(false);
    expect(schemas.url.safeParse("https://uniswap.org").success).toBe(true);
  });

  it("returns correct error message for invalid URL", () => {
    const result = schemas.url.safeParse("not-a-url");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Enter a valid URL");
    }
  });
});
