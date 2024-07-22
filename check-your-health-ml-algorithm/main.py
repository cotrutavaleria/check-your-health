from flasgger import Swagger
from flask import Flask, request
from flask_cors import cross_origin, CORS
from scripts.controllers import *
from scripts.services.naive_bayes import PreprocessingService
from werkzeug.serving import run_simple
from werkzeug.middleware.dispatcher import DispatcherMiddleware

app = Flask(__name__)
app.config['APPLICATION_ROOT'] = "/api/v1"
app.config['CORS_HEADERS'] = 'Content-Type'
CORS(app)
swagger = Swagger(app)


def init_symptom_checker_controller():
    dataset_path = "dataset/dataset.csv"
    training_dataset_path = "dataset/Training.csv"
    testing_dataset_path = "dataset/Testing.csv"
    dataset_list = [dataset_path, training_dataset_path, testing_dataset_path]
    preprocessing_service = PreprocessingService(dataset_list)
    return SymptomsController(preprocessing_service)


symptoms_controller = init_symptom_checker_controller()


@app.route('/symptoms', methods=['GET'])
@cross_origin()
def get_symptoms():
    """
    Lists all symptoms separated into categories of diseases.
    ---
    responses:
      200:
        description: A JSON object containing a list of all available categorized symptoms
        schema:
            type: object
    """
    return symptoms_controller.get_symptoms_list()


@app.route('/health-status', methods=['POST'])
@cross_origin()
def verify_symptoms():
    """
    Checks a list of symptoms for predicting a disease.
    ---
    parameters:
      - in: body
        name: symptoms
        required: true
    responses:
      200:
        description: A JSON object containing the name of the disease predicted, its description and a list of some precautions
    """
    symptoms = request.json
    return symptoms_controller.verify_symptoms(symptoms['symptoms'])


@app.route('/categories', methods=['GET'])
@cross_origin()
def get_categories():
    """
   Lists all categories of diseases.
   ---
   responses:
     200:
       description: A JSON object containing a list of all available disease categories
       schema:
           type: object
   """
    return symptoms_controller.get_categories_list()


if __name__ == '__main__':
    application = DispatcherMiddleware(Flask('dummy_app'), {
        app.config['APPLICATION_ROOT']: app,
    })
    run_simple('localhost', 8082, application, use_reloader=True)
