import pandas as pd 
import pickle as pk
import streamlit as st

#video_file = open('video1.mp4', 'rb')
#st.video(video_file)

model = pk.load(open('/Users/shalinigavel4/Desktop/Project/HousePrice/House_price.pkl', 'rb'))

st.header ('Predicti-Fi')
data = pd.read_csv('/Users/shalinigavel4/Desktop/Project/HousePrice/cleaned_data.csv')
loc = st.selectbox('Choose the location', data['location'].unique())
sqft = st.number_input('Enter total sqft.')
beds = st.number_input('Enter number of bedrooms')
baths = st.number_input('Enter number of bathrooms')
balc = st.number_input('Enter number of balconies')


input_data = pd.DataFrame([[loc,sqft,baths,balc,beds]], columns=['location', 'total_sqft', 'bath', 'balcony','bedrooms'])

if st.button("Predict Price"):
    output = model.predict(input_data)
    out_str = 'Price of the house is ' + str(output[0]*100000) + ' INR'
    st.success(out_str)