import pandas as pd
import pickle as pk
import streamlit as st
from streamlit_lottie import st_lottie # type: ignore
import requests

# --- Load model and data ---
model = pk.load(open('House_price.pkl', 'rb'))
data = pd.read_csv('cleaned_data.csv')

# --- Custom CSS for background ---
st.markdown("""
    <style>
    .stApp {
        background-color: #f4f6f9;
        font-family: 'Segoe UI', sans-serif;
    }
    .main-title {
        font-size: 40px;
        text-align: center;
        color: #003366;
    }
    </style>
""", unsafe_allow_html=True)

# --- Lottie animation loader ---
def load_lottieurl(url):
    r = requests.get(url)
    if r.status_code != 200:
        return None
    return r.json()

lottie_house = load_lottieurl("https://assets1.lottiefiles.com/packages/lf20_jcikwtux.json")  # change as needed

# --- Title and animation ---
st.markdown('<h1 class="main-title">🏡 Predicti-Fi</h1>', unsafe_allow_html=True)
st.markdown('<h4 class="main-title"> Because Every Rupee Matters </h4>', unsafe_allow_html=True)
st_lottie(lottie_house, height=300, key="house")


# --- Inputs in two columns ---
with st.container():
    st.subheader("Enter Property Details")
    col1, col2 = st.columns(2)

    with col1:
        loc = st.selectbox('📍 Location', sorted(data['location'].unique()))
        sqft = st.slider('📐 Total Sqft', 500, 10000, 1000)
        beds = st.slider('🛏️ Bedrooms', 1, 10, 2)

    with col2:
        baths = st.slider('🛁 Bathrooms', 1, 10, 2)
        balc = st.slider('🚪 Balconies', 0, 5, 1)

# --- Prediction ---
input_data = pd.DataFrame([[loc, sqft, baths, balc, beds]],
                          columns=['location', 'total_sqft', 'bath', 'balcony', 'bedrooms'])



if st.button("🔍 Predict Price"):
    output = model.predict(input_data)
    price = round(output[0] * 100000, 2)
    st.success(f"💰 **Estimated Price: ₹{price:,.2f}**")

    st.balloons()  # celebratory animation

# --- Intro video ---
st.video("Record.mov")  # Example Recorded video