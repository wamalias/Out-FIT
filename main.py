from fastapi import FastAPI, File, UploadFile
import keras as krs
import numpy as np
import requests
import tensorflow as tf
import requests
import cv2
import uuid

IMAGEDIR = "images/"

# Dictionary for mapping class indices to labels
types_dict = ['Blazer', 'Dress', 'Jacket', 'Pants', 'Shirt', 'Short', 'Skirt', 'Top', 'Tshirt']

# URL of the model in cloud storage
url = 'https://storage.googleapis.com/model-outfit/fashion_classifier_model.h5'

# Local path where the model will be saved
local_path = 'fashion_classifier_model.h5'

# Download the model
response = requests.get(url)
if response.status_code == 200:
    with open(local_path, 'wb') as f:
        f.write(response.content)
else:
    print(f"Failed to download the model. Status code: {response.status_code}")

# Load the model
model = tf.keras.models.load_model(local_path)

# Use the model
# print(model.summary())

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/detectColors")
def detect_colors(file: UploadFile = File(...)):
    img = tf.keras.utils.load_img(file.filename, target_size=(150, 150))
    input_image = cv2.imread(img)
    # Convert image to HSV
    hsv = cv2.cvtColor(input_image, cv2.COLOR_BGR2HSV)

    # Define color ranges in HSV
    red_lower = np.array([0, 50, 50])
    red_upper = np.array([10, 255, 255])
    blue_lower = np.array([110, 50, 50])
    blue_upper = np.array([130, 255, 255])
    yellow_lower = np.array([20, 100, 100])
    yellow_upper = np.array([30, 255, 255])
    green_lower = np.array([50, 50, 50])
    green_upper = np.array([70, 255, 255])
    black_lower = np.array([0, 0, 0])
    black_upper = np.array([180, 255, 30])
    white_lower = np.array([0, 0, 200])
    white_upper = np.array([180, 20, 255])
    gray_lower = np.array([0, 0, 50])
    gray_upper = np.array([180, 20, 200])
    brown_lower = np.array([10, 100, 20])
    brown_upper = np.array([20, 255, 200])

    # Create masks for each color
    mask_red = cv2.inRange(hsv, red_lower, red_upper)
    mask_blue = cv2.inRange(hsv, blue_lower, blue_upper)
    mask_yellow = cv2.inRange(hsv, yellow_lower, yellow_upper)
    mask_green = cv2.inRange(hsv, green_lower, green_upper)
    mask_black = cv2.inRange(hsv, black_lower, black_upper)
    mask_white = cv2.inRange(hsv, white_lower, white_upper)
    mask_gray = cv2.inRange(hsv, gray_lower, gray_upper)
    mask_brown = cv2.inRange(hsv, brown_lower, brown_upper)
    # Combine all masks
    mask_combined = mask_red + mask_blue + mask_yellow + mask_green + mask_black + mask_white + mask_gray + mask_brown

    # Apply morphology to clean up the masks
    kernel = np.ones((5, 5), np.uint8)
    mask_combined = cv2.morphologyEx(mask_combined, cv2.MORPH_CLOSE, kernel)

    # Find contours
    contours, _ = cv2.findContours(mask_combined, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Draw bounding boxes and labels
    detected_colors = []
    for contour in contours:
        area = cv2.contourArea(contour)
        if area > 100:
            x, y, w, h = cv2.boundingRect(contour)
            color_text = None
            if mask_red[y + h // 2][x + w // 2] == 255:
                color_text = "Red"
                color_code = (0, 0, 255)
            elif mask_blue[y + h // 2][x + w // 2] == 255:
                color_text = "BLue"
                color_code = (255, 0, 0)
            elif mask_yellow[y + h // 2][x + w // 2] == 255:
                color_text = "Yellow"
                color_code = (0, 255, 255)
            elif mask_green[y + h // 2][x + w // 2] == 255:
                color_text = "Green"
                color_code = (0, 255, 0)
            elif mask_black[y + h // 2][x + w // 2] == 255:
                color_text = "Black"
                color_code = (0, 0, 0)
            elif mask_white[y + h // 2][x + w // 2] == 255:
                color_text = "White"
                color_code = (255, 255, 255)
            elif mask_gray[y + h // 2][x + w // 2] == 255:
                color_text = "Gey"
                color_code = (128, 128, 128)
            elif mask_brown[y + h // 2][x + w // 2] == 255:
                color_text = "Brown"
                color_code = (42, 42, 165)

            if color_text:
                detected_colors.append(color_text)
                y_pos = y - 10 if y - 10 > 10 else y + 20
                cv2.putText(input_image, color_text, (x + w + 10, y_pos), cv2.FONT_HERSHEY_SIMPLEX, 0.7, color_code, 2)

    return input_image, detected_colors

@app.post("/detectOutfit")
async def predict_outfit(file: UploadFile = File(...)):
    # Lakukan prediksi
    img = tf.keras.utils.load_img(file.filename, target_size=(150, 150))
    img_array = tf.keras.utils.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0) / 255.0

    predictions = model.predict(img_array)
    predicted_class = np.argmax(predictions[0])
    predicted_label = types_dict[predicted_class]

    confidence_score = predictions[0][predicted_class] * 100

    return predicted_label, confidence_score

