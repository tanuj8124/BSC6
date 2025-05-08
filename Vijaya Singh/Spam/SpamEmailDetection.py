import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
import streamlit as st

#Read the Data
data = pd.read_csv("spam.csv")

#Clean the Data
data.drop_duplicates(inplace=True)

#Categorize the Data
data['Category'] = data['Category'].replace(['ham','spam'],['Not Spam','Spam'])

mess = data['Message']
cat = data['Category']

#Split the Data into Train ad Test Data
(mess_train,mess_test,cat_train,cat_test) = train_test_split(mess,cat,test_size=0.2)

cv = CountVectorizer(stop_words='english')
features = cv.fit_transform(mess_train)

#Creating Model

model = MultinomialNB()
model.fit(features, cat_train)

#Test our Model
features_test = cv.transform(mess_test)
#print(model.score(features_test,cat_test))
#Predict Data
def predict(message):
    input_message = cv.transform([message]).toarray()
    result = model.predict(input_message)
    return result

st.header('Spam Email Detection')


output = predict('Congratulations you won a lottery')
input_mess = st.text_input('Enter Message Here')

if st.button('Validate'):
    output = predict(input_mess)
    st.markdown(output)