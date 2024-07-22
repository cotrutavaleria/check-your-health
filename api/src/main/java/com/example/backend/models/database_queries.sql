CREATE DATABASE symptochecker;
use symptochecker;
drop database symptochecker;
SHOW TABLES;

SET FOREIGN_KEY_CHECKS=0;
SET FOREIGN_KEY_CHECKS=1; 
INSERT INTO specialties (romanianName, englishName)
VALUES
    ('Alergolog și imunolog clinic', 'Allergist and Clinical Immunologist'),
    ('Anestezist și terapeut intensiv', 'Anesthesiologist and Intensive Care Specialist'),
    ('Specialist în boli infecțioase', 'Infectious Diseases Specialist'),
    ('Cardiolog', 'Cardiologist'),
    ('Cardiolog pediatric', 'Pediatric Cardiologist'),
    ('Dermatolog-venerolog', 'Dermatovenereologist'),
    ('Diabetolog și specialist în nutriție și boli metabolice', 'Diabetologist and Specialist in Nutrition and Metabolic Diseases'),
    ('Endocrinolog', 'Endocrinologist'),
    ('Expert medical în capacitatea de muncă', 'Medical Expert in Work Capacity'),
    ('Farmacolog clinic', 'Clinical Pharmacologist'),
    ('Gastroenterolog', 'Gastroenterologist'),
    ('Gastroenterolog pediatric', 'Pediatric Gastroenterologist'),
    ('Genetician medical', 'Medical Geneticist'),
    ('Geriatru și specialist în gerontologie', 'Geriatrician and Gerontology Specialist'),
    ('Hematolog', 'Hematologist'),
    ('Medic de familie', 'Family Doctor'),
    ('Medic de urgență', 'Emergency Doctor'),
    ('Medic internist', 'Internist'),
    ('Medic fizioterapeut și de reabilitare', 'Physiotherapist and Rehabilitation Specialist'),
    ('Medic specialist în medicina muncii', 'Occupational Health Specialist'),
    ('Medic specialist în medicina sportivă', 'Sports Medicine Specialist'),
    ('Nefrolog', 'Nephrologist'),
    ('Nefrolog pediatric', 'Pediatric Nephrologist'),
    ('Neonatolog', 'Neonatologist'),
    ('Neurolog', 'Neurologist'),
    ('Neurolog pediatric', 'Pediatric Neurologist'),
    ('Oncolog medical', 'Medical Oncologist'),
    ('Oncolog și hematolog pediatric', 'Pediatric Oncologist and Hematologist'),
    ('Pediatru', 'Pediatrician'),
    ('Pneumolog', 'Pulmonologist'),
    ('Pneumolog pediatric', 'Pediatric Pulmonologist'),
    ('Psihiatru', 'Psychiatrist'),
    ('Psihiatru pediatric', 'Pediatric Psychiatrist'),
    ('Radioterapeut', 'Radiation Oncologist'),
    ('Reumatolog', 'Rheumatologist'),
    ('Chirurg cardiovascular', 'Cardiovascular Surgeon'),
    ('Chirurg general', 'General Surgeon'),
    ('Chirurg oral și maxilo-facial', 'Oral and Maxillofacial Surgeon'),
    ('Chirurg pediatric', 'Pediatric Surgeon'),
    ('Chirurg plastic, estetic și microchirurgie reconstructivă', 'Plastic, Aesthetic, and Reconstructive Surgeon'),
    ('Chirurg toracic', 'Thoracic Surgeon'),
    ('Chirurg vascular', 'Vascular Surgeon'),
    ('Neurochirurg', 'Neurosurgeon'),
    ('Obstetrician-ginecolog', 'Obstetrician-Gynecologist'),
    ('Oftalmolog', 'Ophthalmologist'),
    ('Ortoped pediatric', 'Pediatric Orthopedist'),
    ('Ortoped și traumatologie', 'Orthopedic and Trauma Surgeon'),
    ('Otorinolaringolog', 'Otorhinolaryngologist'),
    ('Urolog', 'Urologist'),
    ('Anatom patolog', 'Pathologist'),
    ('Epidemiolog', 'Epidemiologist'),
    ('Igienist', 'Hygienist'),
    ('Medic de laborator', 'Laboratory Doctor'),
    ('Medic legist', 'Forensic Doctor'),
    ('Medic nuclearist', 'Nuclear Medicine Specialist'),
    ('Microbiolog medical', 'Medical Microbiologist'),
    ('Radiolog-imagist medical', 'Medical Radiologist-Imager'),
    ('Specialist în sănătate publică și management', 'Public Health and Management Specialist'),
    ('Chirurg dento-alveolar', 'Dentoalveolar Surgeon'),
    ('Ortodont și ortopedie dento-facială', 'Orthodontist and Dentofacial Orthopedist'),
    ('Endodont', 'Endodontist'),
    ('Parodontolog', 'Periodontologist'),
    ('Pedodont', 'Pedodontist'),
    ('Protetician dentar', 'Dental Prosthodontist');