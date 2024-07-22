from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score, f1_score


class NaiveBayes:
    def __init__(self, preprocessing):
        self.preprocessing = preprocessing
        (self.training_features, self.training_target_variable, self.testing_features,
         self.testing_target_variable) = self.preprocessing.split_features_target_variables()
        self.naive_bayes = MultinomialNB()

    def train(self):
        self.naive_bayes.fit(self.training_features.values, self.training_target_variable)
        prediction = self.naive_bayes.predict(self.testing_features.values)
        print("Accuracy:", accuracy_score(self.testing_target_variable, prediction))
        print('F1-score:', f1_score(self.testing_target_variable, prediction, average='macro'))

    def predict(self, symptoms_list):
        prediction_features = [0] * len(self.training_features.columns)
        for symptom in symptoms_list:
            if symptom in self.training_features.columns:
                prediction_features[self.training_features.columns.get_loc(symptom)] = 1
        prediction = self.naive_bayes.predict([prediction_features])
        return prediction

