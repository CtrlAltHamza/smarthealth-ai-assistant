DELETE FROM doctors WHERE "userId" IN ('22222222-2222-2222-2222-222222222222');
DELETE FROM patients WHERE "userId" IN ('11111111-1111-1111-1111-111111111111');
DELETE FROM users WHERE id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333');

INSERT INTO users (id, name, email, password, role, phone, "isActive", "isVerified", "createdAt", "updatedAt") VALUES
('11111111-1111-1111-1111-111111111111', 'Patient Demo', 'patient@demo.com', '$2a$12$M8mGejAossdjcnSJKbyFxekWwqRg1jPo46H5EfAcDGbItVlHY13/C', 'patient', '+1234567890', true, true, NOW(), NOW()),
('22222222-2222-2222-2222-222222222222', 'Doctor Demo', 'doctor@demo.com', '$2a$12$M8mGejAossdjcnSJKbyFxekWwqRg1jPo46H5EfAcDGbItVlHY13/C', 'doctor', '+0987654321', true, true, NOW(), NOW()),
('33333333-3333-3333-3333-333333333333', 'Admin Demo', 'admin@demo.com', '$2a$12$M8mGejAossdjcnSJKbyFxekWwqRg1jPo46H5EfAcDGbItVlHY13/C', 'admin', '+1122334455', true, true, NOW(), NOW());

INSERT INTO patients (id, "userId", gender, "bloodType", height, weight, allergies, "chronicConditions", "createdAt", "updatedAt") VALUES
('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'male', 'O+', 175, 70, '{"Peanuts"}', '{}', NOW(), NOW());

INSERT INTO doctors (id, "userId", specialization, qualifications, experience, "licenseNumber", "consultationFee", rating, "totalReviews", bio, "createdAt", "updatedAt") VALUES
('55555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', 'General Practitioner', '{"MD","Board Certified"}', 10, 'LIC001', 50.00, 4.8, 120, 'Experienced general practitioner with 10 years of practice', NOW(), NOW());