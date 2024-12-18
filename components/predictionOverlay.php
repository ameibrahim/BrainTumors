<div class="overlay prediction-overlay">
    <div class="popup prediction-popup">
        <div class="popup-header">
            <div class="close-button" onclick="
            closePopup('.prediction-overlay');
            resetPredictionOverlay();
            ">
                <img src="../assets/icons/close.png" alt="">
            </div>
            <h1 class="pop-up-title">
                <div class="prediction-title">Predict Brain Tumor</div>
            </h1> 
        </div>

        <div class="popup-body predict-body">

            <label for="image-predict" class="image-upload-wrapper">
                <div class="select-image">
                    click here to select or take an image to predict
                </div>
                <img src class="image-predict-chosen-preview" alt="">
                <input style="display:none;" type="file" id="image-predict" accept="image/*" onchange="handlePredictingImageChange(event)">
            </label>
            
        </div>

        <div class="popup-footer">
            <button class="button" onclick="startPrediction()">
                <div class="button-loader round-loader" style="display: none;"></div>
                <div class="button-text">select an mri image for prediction</div>
            </button>
        </div>
    </div>
</div>