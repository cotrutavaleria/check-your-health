from scripts.services.symptoms_service import SymptomsService


class SymptomsController:
    def __init__(self, preprocessing):
        self.preprocessing = preprocessing
        self.symptomsService = SymptomsService(self.preprocessing)

    def get_symptoms_list(self):
        try:
            return self.symptomsService.get_symptoms_by_category()
        except Exception as exception:
            return {'message': exception.args[0]}, 500

    def get_categories_list(self):
        try:
            categories = self.symptomsService.get_categories()
            if categories:
                return {"categories": categories}, 200
            raise Exception("No symptom categories available.")
        except Exception as exception:
            return {'message': exception.args[0]}, 500

    def verify_symptoms(self, symptoms):
        try:
            return self.symptomsService.verify_symptoms(symptoms)
        except ValueError as exception:
            return {'message': exception.args[0]}, 409
        except Exception as exception:
            return {'message': exception.args[0]}, 500
