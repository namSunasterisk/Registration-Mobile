import { test, expect } from "@playwright/test";
import { request } from "node:http";
import fs from "fs";
import path from "path";

test.describe.configure({ mode: "serial" });

const randomEmail = `user${Math.floor(Math.random() * 10000)}@example.com`;
const password = "SecurePass123!";
let savedIDNumber: number;
let registrationKey: string;

test("API Email", async ({ request }) => {
  const response = await request.post("api/cruint/auth/register/email", {
    data: {
      email: randomEmail,
    },
  });

  expect(
    response.status(),
    "Email registration response status should be 200",
  ).toBe(200);
  const responseBody = await response.json();
  expect(responseBody).toStrictEqual({
    data: {
      expires_in: 300,
    },
    message:
      "OTP has been sent to your email address. Please check your inbox.",
    code: "200",
  });
});

test("API Verify OTP", async ({ request }) => {
  const response = await request.post("api/cruint/auth/register/verify-otp", {
    data: {
      email: randomEmail,
      otp_code: "123456",
    },
  });

  expect(response.status(), "Verify OTP response status should be 200").toBe(
    200,
  );
  const responseBody = await response.json();
  expect(responseBody).toStrictEqual({
    code: "200",
    message: "Email verified successfully. Please set your password.",
    data: {
      temp_user_id: expect.any(Number),
      email: randomEmail,
      status: "otp_verified",
      registration_key: expect.any(String),
    },
  });
  savedIDNumber = responseBody.data.temp_user_id;
  registrationKey = responseBody.data.registration_key;
});

test("API Set Password", async ({ request }) => {
  const response = await request.post("api/cruint/auth/register/password", {
    data: {
      email: randomEmail,
      password,
      confirm_password: password,
      registration_key: registrationKey,
    },
  });

  expect(response.status(), "Set Password response status should be 200").toBe(
    200,
  );
  const responseBody = await response.json();
  expect(responseBody).toStrictEqual({
    code: "200",
    message: "Password set successfully",
    data: {
      email: randomEmail,
      registration_key: registrationKey,
      status: "password_set",
      temp_user_id: savedIDNumber,
    },
  });
});

test("API Fill Profile", async ({ request }) => {
  const response = await request.post("api/cruint/auth/register/profile", {
    data: {
      first_name: "John",
      last_name: "Doe",
      title: "Mr",
      dob: "1990-01-01",
      mobile_phone: "+36345678969",
      sex_at_birth: "Male",
      country_of_origin: "Hungary",
      country_code: "HU",
      registration_key: registrationKey,
    },
  });

  expect(response.status(), "Fill Profile response status should be 200").toBe(
    200,
  );
  const responseBody = await response.json();
  expect(responseBody).toStrictEqual({
    code: "200",
    message: "Registration completed successfully. You are now logged in.",
    data: {
      access_token: expect.any(String),
      country_code: "HU",
      country_of_origin: "Hungary",
      dob: "1990-01-01",
      email: randomEmail,
      expires_in: 86400,
      first_name: "John",
      last_name: "Doe",
      mobile_phone: "+36345678969",
      patient_id: expect.any(Number),
      sex_at_birth: "Male",
      title: "Mr",
      token_type: "Bearer",
      user_id: expect.any(Number),
    },
  });
});

console.log("Tested registration for email:", randomEmail);
console.log("Password: SecurePass123!");

async function appendCredentialsTable(email: string, pwd: string) {
  try {
    const outDir = path.resolve(process.cwd(), "test-results");
    const outFile = path.join(outDir, "registrations.md");
    await fs.promises.mkdir(outDir, { recursive: true });
    const header = "| Email | Password |\n|---|---|\n";
    const row = `| ${email} | ${pwd} |\n`;
    const exists = await fs.promises
      .access(outFile, fs.constants.F_OK)
      .then(() => true)
      .catch(() => false);
    if (!exists) {
      await fs.promises.writeFile(outFile, header + row, "utf8");
    } else {
      await fs.promises.appendFile(outFile, row, "utf8");
    }
  } catch (err) {
    console.error("Failed to write credentials:", err);
  }
}

test.afterAll(async () => {
  await appendCredentialsTable(randomEmail, password);
});