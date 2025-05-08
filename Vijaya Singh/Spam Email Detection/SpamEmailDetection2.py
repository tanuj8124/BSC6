import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
import streamlit as st
from streamlit_lottie import st_lottie
import requests

# Load Lottie Animation from URL
def load_lottie_url(url):
    r = requests.get(url)
    if r.status_code != 200:
        return None
    return r.json()

# Load animations
spam_anim = load_lottie_url("https://assets2.lottiefiles.com/packages/lf20_jcikwtux.json")
not_spam_anim = load_lottie_url("https://assets2.lottiefiles.com/packages/lf20_touohxv0.json")
loading_anim = load_lottie_url("https://assets2.lottiefiles.com/packages/lf20_usmfx6bp.json")

# Read the Data
data = pd.read_csv("spam.csv")
data.drop_duplicates(inplace=True)
data['Category'] = data['Category'].replace(['ham', 'spam'], ['Not Spam', 'Spam'])

mess = data['Message']
cat = data['Category']

# Split the Data
mess_train, mess_test, cat_train, cat_test = train_test_split(mess, cat, test_size=0.2)

cv = CountVectorizer(stop_words='english')
features = cv.fit_transform(mess_train)

# Train Model
model = MultinomialNB()
model.fit(features, cat_train)

# Prediction Function
def predict(message):
    input_message = cv.transform([message]).toarray()
    result = model.predict(input_message)
    return result[0]

# Streamlit Interface
st.title('📨 Spam Email Detection')

input_mess = st.text_input('Enter a message to check if it is spam:')

if st.button('🔍 Validate'):
    with st.spinner("Analyzing..."):
        st_lottie(loading_anim, height=150)
        result = predict(input_mess)

    st.subheader(f"Result: **{result}**")
    
    if result == "Spam":
        st_lottie(spam_anim, height=250)
        st.error("⚠️ This message is likely spam.")
    else:
        st_lottie(not_spam_anim, height=250)
        st.success("✅ This message seems safe.")
