import os.path

import numpy as np
import pandas as pd


class PreprocessingService:

    def __init__(self, datasets_list):
        self.dataset = self.read_dataset(datasets_list[0])
        self.training_dataset = self.read_dataset(datasets_list[1])
        self.testing_dataset = self.read_dataset(datasets_list[2])

    @staticmethod
    def read_dataset(path):
        try:
            if os.path.isfile(path):
                return pd.read_csv(path)
            raise FileNotFoundError(f"File {path} not found.")
        except FileNotFoundError:
            return None

    def split_features_target_variables(self):
        self.dataset = self.dataset.replace(np.nan, "")
        _training_features = self.training_dataset.drop("prognosis", axis=1)
        _training_target_variable = self.training_dataset.prognosis.copy()

        _testing_features = self.testing_dataset.drop("prognosis", axis=1)
        _testing_target_variable = self.testing_dataset.prognosis.copy()

        return _training_features, _training_target_variable, _testing_features, _testing_target_variable
