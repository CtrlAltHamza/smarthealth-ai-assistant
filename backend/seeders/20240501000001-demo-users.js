const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface, Sequelize) {
    // Hash the demo password: Demo1234!
    const hashedPassword = await bcrypt.hash("Demo1234!", 12);
    const now = new Date();

    // Create demo users
    const users = await queryInterface.bulkInsert("users", [
      {
        id: "11111111-1111-1111-1111-111111111111",
        name: "Patient Demo",
        email: "patient@demo.com",
        password: hashedPassword,
        role: "patient",
        phone: "+1234567890",
        isActive: true,
        isVerified: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "22222222-2222-2222-2222-222222222222",
        name: "Doctor Demo",
        email: "doctor@demo.com",
        password: hashedPassword,
        role: "doctor",
        phone: "+0987654321",
        isActive: true,
        isVerified: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "33333333-3333-3333-3333-333333333333",
        name: "Admin Demo",
        email: "admin@demo.com",
        password: hashedPassword,
        role: "admin",
        phone: "+1122334455",
        isActive: true,
        isVerified: true,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    // Create patient profile
    await queryInterface.bulkInsert("patients", [
      {
        id: "44444444-4444-4444-4444-444444444444",
        userId: "11111111-1111-1111-1111-111111111111",
        gender: "male",
        bloodType: "O+",
        height: 175,
        weight: 70,
        allergies: ["Peanuts"],
        chronicConditions: [],
        createdAt: now,
        updatedAt: now,
      },
    ]);

    // Create doctor profile
    await queryInterface.bulkInsert("doctors", [
      {
        id: "55555555-5555-5555-5555-555555555555",
        userId: "22222222-2222-2222-2222-222222222222",
        specialization: "General Practitioner",
        qualifications: ["MD", "Board Certified"],
        experience: 10,
        licenseNumber: "LIC001",
        consultationFee: 50.00,
        rating: 4.8,
        totalReviews: 120,
        bio: "Experienced general practitioner with 10 years of practice",
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("doctors", {
      userId: ["22222222-2222-2222-2222-222222222222"],
    });
    await queryInterface.bulkDelete("patients", {
      userId: ["11111111-1111-1111-1111-111111111111"],
    });
    await queryInterface.bulkDelete("users", {
      email: ["patient@demo.com", "doctor@demo.com", "admin@demo.com"],
    });
  },
};
