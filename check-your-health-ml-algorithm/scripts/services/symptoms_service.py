from scripts.services.disease_service import DiseaseService
from scripts.services.naive_bayes.naive_bayes_algorithm import NaiveBayes


class SymptomsService:
    def __init__(self, preprocessing):
        self.preprocessing = preprocessing
        self.symptom_severity_path = "dataset/additional/symptom_severity.csv"
        self.disease_precaution_path = "dataset/additional/disease_precaution.csv"
        self.disease_description_path = "dataset/additional/disease_description.csv"

    @staticmethod
    def __verify_dataset(columns, dataset, path):
        if dataset is None:
            print(f"File {path} not found.")
            raise Exception(f"File {path} not found.")
        if dataset.empty:
            print("Dataset is empty.")
            raise Exception("Dataset is empty.")
        for column in columns:
            if column not in dataset.columns:
                print(f"Dataset from {path} does not contain {column} column.")
                raise Exception(f"Dataset from {path} does not contain {column} column.")
        return True

    def __use_naive_bayes(self, symptoms):
        naive_bayes = NaiveBayes(self.preprocessing)
        naive_bayes.train()
        disease_prediction = naive_bayes.predict(symptoms)[0]
        return disease_prediction

    def __get_description(self, disease_service, disease_prediction):
        disease_description_dataset = self.preprocessing.read_dataset(self.disease_description_path)
        if self.__verify_dataset(['Symptom_Description'], disease_description_dataset, self.disease_description_path):
            disease_description = disease_service.get_description(disease_prediction,
                                                                  disease_description_dataset)
            return disease_description
        return "No disease description provided."

    def __get_precautions_list(self, disease_service, disease_prediction):
        columns_list = ["Disease", "Symptom_precaution_0", "Symptom_precaution_1", "Symptom_precaution_2",
                        "Symptom_precaution_3"]
        disease_precaution_dataset = self.preprocessing.read_dataset(self.disease_precaution_path)
        if self.__verify_dataset(columns_list, disease_precaution_dataset, self.disease_precaution_path):
            disease_precautions = disease_service.get_precautions_list(disease_prediction,
                                                                       disease_precaution_dataset)
            return disease_precautions
        return "No disease precautions provided."

    def __get_symptoms_dictionary(self):
        general = "fever, fatigue, weight, malaise, appetite, weakness, lethargy, sweating, shivering, dehydration"
        gastrointestinal = ("stool, micturition, urine, diarrhoea, nausea, vomiting, abdominal, stomach, indigestion, "
                            "constipation, gases, bowel, liver")
        respiratory = "nose, throat, cough, sneezing, sputum, congestion, breathlessness"
        cardiovascular = "heart, chest, veins, blood vessels, palpitations, hypertension, fever, high blood pressure"
        neurological = ("headache, dizziness, balance, speech, coordination, sensory, sensorium, unsteadiness, "
                        "concentration, coma")
        musculoskeletal = "pain, swelling, joints, stiffness, cramps, limbs, muscle"
        dermatological = "skin, rash, itching, nails, patches, blister, peeling, bruising, redness, eruption"
        psychological = "mood, irritability, depression, anxiety, concentration, swings, restlessness"
        genitourinary = "menstruation, urination, bladder, genital, reproductive"
        endocrine = "thyroid, sugar level, metabolism, liver, appetite, dehydration"
        categories_list = [general, gastrointestinal, respiratory, cardiovascular, neurological,
                           musculoskeletal, dermatological, psychological, genitourinary, endocrine]
        category_names = self.get_categories()
        category_names.remove("others")
        keywords_categories_list = zip(category_names, categories_list)
        return keywords_categories_list

    @staticmethod
    def get_categories():
        categories = ("general, gastrointestinal, respiratory, cardiovascular, neurological, musculoskeletal, "
                      "dermatological, psychological, genitourinary, endocrine, others").split(", ")
        return categories

    def __return_categories_response(self):
        categories = self.get_categories()
        categories_response = {}
        for category in categories:
            categories_response.setdefault(category, list())
        return categories_response

    def __get_symptoms(self):
        symptom_severity_dataset = self.preprocessing.read_dataset(self.symptom_severity_path)
        if self.__verify_dataset(['Symptom'], symptom_severity_dataset, self.symptom_severity_path):
            symptoms = list(set(
                map(lambda element: element.replace("_", " "), symptom_severity_dataset.Symptom.values)))
            if symptoms:
                return symptoms
            raise Exception("Symptoms list is empty.")
        return None

    @staticmethod
    def __verify_symptoms(response, symptom):
        is_categorized = False
        for value in response.values():
            if symptom in value:
                is_categorized = True
                break
        return is_categorized

    def get_symptoms_by_category(self):
        symptoms = self.__get_symptoms()
        response = self.__return_categories_response()
        keywords_categories_list = list(self.__get_symptoms_dictionary())
        for symptom in symptoms:
            for category in keywords_categories_list:
                category_name = category[0]
                keywords = category[1].split(", ")
                for keyword in keywords:
                    if keyword in symptom:
                        is_categorized = self.__verify_symptoms(response, symptom)
                        if not is_categorized:
                            symptoms_list = response[category_name]
                            symptoms_list.append(symptom)
                            response[category_name] = symptoms_list
        for symptom in symptoms:
            is_categorized = self.__verify_symptoms(response, symptom)
            if not is_categorized:
                response["others"].append(symptom)
        return {"symptoms": response}, 200

    def verify_symptoms(self, symptoms):
        if not symptoms:
            return {"disease": "No disease.", "description": "", "precautions": []}, 200

        all_symptoms = self.__get_symptoms()
        valid_symptoms = list()
        for symptom in symptoms:
            if symptom in all_symptoms:
                symptom = symptom.replace(" ", "_")
                valid_symptoms.append(symptom)
        if not valid_symptoms:
            raise ValueError("Valid symptoms list is empty.")
        disease_prediction = self.__use_naive_bayes(valid_symptoms)
        if disease_prediction == "" or disease_prediction is None:
            return {"disease": "No disease.", "description": "", "precautions": []}, 200

        disease_service = DiseaseService()
        disease_description = self.__get_description(disease_service, disease_prediction)
        disease_precautions = self.__get_precautions_list(disease_service, disease_prediction)
        return {"disease": disease_prediction, "description": disease_description,
                "precautions": disease_precautions}, 200
