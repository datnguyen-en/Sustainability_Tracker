import pandas as pd
import streamlit as st


# Loading the Data from the CSV file
air_quality_data = pd.read_csv('AQI-and-Lat-Long-of-Countries.csv')


# Printing the first 5 rows of the Dataframe
air_quality_data.head()


air_quality_data.info()

from sklearn.ensemble import RandomForestRegressor, AdaBoostRegressor



#CREATING MODEL
m1= RandomForestRegressor()


train1= air_quality_data.drop(['AQI Value'], axis=1)

target= air_quality_data['AQI Value']

print(train1)
print(target)




#FITTING THE MODEL
m1.fit(train1, target)

m1.score(train1, target)*100

# predicting the model with other values (testing the data)
prediction_result= m1.predict([[1, 10, 5, 11, 10, 5]])

print(prediction_result)




# Adaboost model
# importing module

from sklearn.ensemble import AdaBoostRegressor


# defining model
m2 = AdaBoostRegressor()

# Fitting the model
m2.fit(train1, target)

'''AdaBoostRegressor(base_estimator=None, learning_rate=1.0, loss='linear',
                  n_estimators=50, random_state=None)'''

m2.score(train1, target)*100

# predicting the model with other values (testing the data)
# so AQI is around 46.96
m2.predict([[1, 45, 67, 34, 5, 23]])


