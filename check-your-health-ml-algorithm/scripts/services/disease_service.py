import numpy as np


class DiseaseService:
    def __init__(self):
        pass

    @staticmethod
    def get_description(disease, disease_description_dataset):
        disease_description_dataset = disease_description_dataset.replace(np.nan, "")
        is_disease_valid = disease_description_dataset[
            disease_description_dataset['Disease'] == disease].Symptom_Description.values
        if not is_disease_valid:
            disease_first_word = disease.split(" ")[0]
            diseases = disease_description_dataset['Disease'].values
            for current_disease in diseases:
                if disease_first_word in current_disease:
                    return disease_description_dataset[
                        disease_description_dataset['Disease'] == current_disease].Symptom_Description.values[0]
        return \
        disease_description_dataset[disease_description_dataset['Disease'] == disease].Symptom_Description.values[0]

    @staticmethod
    def get_precautions_list(disease, disease_precaution_dataset):
        disease_precaution_dataset = disease_precaution_dataset.replace(np.nan, "")
        precautions_list = ""
        for index in range(0, 4):
            precaution = disease_precaution_dataset[disease_precaution_dataset['Disease'] == disease][
                'Symptom_precaution_' + str(index)].values[0]
            if precaution != "":
                if index == 0:
                    first_letter = precaution[0].upper()
                    precautions_list += (first_letter + precaution[1:])
                else:
                    precautions_list += (", " + precaution)
        precautions_list += "."
        return precautions_list
