# Check Your Health Application

## Description
Check Your Health Application (SymptoChecker) is a web application which encourages individual medical education and optimizes the process of finding and determining the right specialist, exerting a positive and constructive influence on the maintenance of health.

## Demo
### Part 1
https://github.com/user-attachments/assets/b5b7d23d-5b58-4d5e-a363-74bdee8b05b7
### Part 2
https://github.com/user-attachments/assets/a189c2be-8daf-4ecf-b0ca-a6e32edf3ee6

## Features
1. It is informative: It provides a daily selection of online news in the medical fields of interest.
2. Offers medical support: Uses a machine learning algorithm specialized in determining a medical condition based on symptoms.
3. It is Interactive: It provides an interactive display of clinic locations using a map by integrating Google Maps and Geocoding JavaScript APIs.
4. It is practical: Clinical appointment management tool; Management of personal data, work schedule and services provided.
5. Review system: Patients share their experiences.
6. Selection of medical specialists: database that includes available doctors and data about the services offered.
7. Quick way to create a medical appointment with any specialist from various clinics.
8. A way of communicating with customers to fix technical problems.

## Architecture

The application consists of 7 components:
1. API: The API is developed using the Java Spring Boot framework. The email system, the database, GNews, Amazon S3, and other external containers of the system are all accessed by the user through the API, which serves as an intermediary agent.
2. Client application: The development process of the client application consists of using the frameworks: Angular version 16, Angular Material and Bootstrap.
3. GNews API: An integrated API that provides a selection of daily medical blog. 
4. Amazon S3: Used to store user profile pictures in a S3 bucket.
5. JavaMail API: An integrated API that sets up connection parameters to the server using the Simple Mail Transfer Protocol (SMTP), such as the host, port, password, and sender's postal address.
6. Check Your Health ML API: There are five sets of data from Kaggle that are used in the API for various purposes. This API was developed using Flask and Werkzeug - two essential frameworks in building a web server. Naive Bayes algorithm from the a Python library, called Scikit-learn, helps to create the API.
   
    A diagnosis is given right away by the "Check Your Health ML API" based on the patient's list of symptoms. Apart from the predicted medical diagnosis, the API returns a concise depiction of the disease and a list of preventive measures that the user may implement.

7. MySQL Database: Used to build a database associated to the application.


