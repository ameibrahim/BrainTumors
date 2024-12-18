import logging
from fastapi import FastAPI, HTTPException, File, Form, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from PIL import Image
import numpy as np
from fastapi.middleware.cors import CORSMiddleware

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()
# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend URL or use ["*"] to allow all origins
    allow_credentials=False,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# model_name = "../models/CNNMRINONMRI-15EP.keras"
# size = 224
# model = None

# @app.on_event("startup")
# async def load_model_into_memory():
#     global model
#     model = load_model(model_name, compile=False)
#     logger.info("Model loaded successfully.")

def preprocess_image(_image, size):
    _image = _image.convert("RGB")  # Ensure the image is in RGB format
    img = _image.resize((size, size), Image.Resampling.LANCZOS)  # Resize to 224x224
    img_array = img_to_array(img, dtype=np.float32)  # Convert to NumPy array
    img_array /= 255.0  # Normalize to range [0, 1]
    img_array = img_array.reshape(1, size, size, 3)  # Add batch dimension
    logger.info(f"Preprocessed image shape: {img_array.shape}")
    return img_array

@app.post("/predict")
async def predict(
    image: UploadFile = File(..., description="The image file to process"),
    featureInputSize: int = Form(..., description="The size to resize the image"),
    modelFilename: str = Form(..., description="The filename of the model to use"),
    labelType: str = Form(..., description="The type of labels to use")
):
    
    def get_labels(label_type: str):
        labels_dict = {
            "uploadscan": {0: "mri", 1: "non-mri"},
            "binary": {0: "no", 1: "yes"},
            "multiclass": {0: "glioma", 1: "meningioma", 2: "notumor", 3: "pituitary"},
            # Add more label types as needed
        }
        
        return labels_dict.get(label_type, {0: "unknown", 1: "unknown"})  # Default case

    try:
        # Log the received form data
        logger.info(f"Received image: {image.filename}")
        logger.info(f"Feature input size: {featureInputSize}")
        logger.info(f"Model filename: {modelFilename}")

        # Load the specified model
        model_path = f"../models/{modelFilename}"
        model = load_model(model_path)
        logger.info(f"Model {modelFilename} loaded successfully.")

        # Open and preprocess the image
        image_data = Image.open(image.file)
        preprocessed_image = preprocess_image(image_data, featureInputSize)

        # Predict using the model
        labels = get_labels(labelType)
        prediction = model.predict(preprocessed_image)
        logger.info(f"Prediction raw output: {prediction}")

        max_prob = float(np.max(prediction[0]))
        predicted_class = labels[int(np.argmax(prediction[0]))]
        classes = {labels[i]: float(round(j * 100, 2)) for i, j in enumerate(prediction[0])}

        # Return the result
        return JSONResponse(content={
            "max_prob": max_prob,
            "predicted_class": predicted_class,
            "class_probabilities": classes
        })

    except Exception as e:
        logger.exception(f"Error processing the request: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing the request: {str(e)}")