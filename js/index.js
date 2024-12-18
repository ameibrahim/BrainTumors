function renderPredictionElementContainer(data) {
  const predictionElementContainer = document.createElement("div");
  predictionElementContainer.className = "prediction-element-container";

  const innerImage = document.createElement("img");
  innerImage.src = "uploads/" + data.imageName;

  const predictionsDescriptions = document.createElement("div");
  predictionsDescriptions.className = "prediction-descriptions";

  const descriptionName = document.createElement("div");
  descriptionName.className = "decription-name";
  descriptionName.textContent = data.imageName;

  const fileSize = document.createElement("div");
  fileSize.className = "filesize";
  fileSize.textContent = data.filesize;

  const predictedClass = document.createElement("div");
  predictedClass.className = "predicted";
  predictedClass.textContent = data.result;

  predictionsDescriptions.append(descriptionName);
  predictionsDescriptions.append(fileSize);
  predictionsDescriptions.append(predictedClass);

  predictionElementContainer.append(innerImage);
  predictionElementContainer.append(predictionsDescriptions);

  predictionElementContainer.addEventListener("click", () =>
    handlePredictionReview(data)
  );

  return predictionElementContainer;
}

function handlePredictionReview(data) {
  const overlay = document.querySelector(".prediction-view-overlay");
  const imageReviewView = overlay.querySelector(".image-review-view");
  const predictionReviewLoader = overlay.querySelector(
    ".prediction-review-loader"
  );
  predictionReviewLoader.style.display = "grid";
  imageReviewView.style.display = "none";

  let {
    date: dateTrained,
    filename,
    accuracy,
    max_prob,
    predicted_class,
    result,
    predicted_stage,
  } = data;

  console.log("preview Pop up data: ", data);

  openPopup(".prediction-view-overlay");

  let predictedClassPlaceholder = overlay.querySelector(
    "#predicted-class-placeholder"
  );
  let predictedDatePlaceholder = overlay.querySelector(
    "#predicted-date-placeholder"
  );
  let predictedModelPlaceholder = overlay.querySelector(
    "#predicted-model-used"
  );
  let predictedModelAccuracy = overlay.querySelector(
    "#predicted-model-accuracy"
  );

  let meterContainer = overlay.querySelector(".stages-container");
  meterContainer.style.display = "grid";
  meterContainer.innerHTML = "";
  let totalStages = 4;

  if (predicted_stage != "stage_0") {
    let stage = predicted_stage.split("_")[1];

    const stageDetails = document.createElement("p");
    stageDetails.textContent = `stage ${stage}`;
    meterContainer.append(stageDetails);

    const meterElement = document.createElement("div");
    meterElement.className = "meter";

    for (let index = 0; index < totalStages; index++) {
      const levelElement = document.createElement("div");
      levelElement.className = `level ${index < stage ? "" : "inactive"}`;
      meterElement.append(levelElement);
    }

    meterContainer.append(meterElement);
  }

  predictedClassPlaceholder.textContent = predicted_class;
  predictedDatePlaceholder.textContent = dateTrained.split("T")[0];
  predictedModelPlaceholder.textContent = filename;
  predictedModelAccuracy.textContent = roundUp(max_prob) + "%";

  setTimeout(() => {
    predictionReviewLoader.style.display = "none";
    imageReviewView.src = "uploads/" + data.imageName;
    imageReviewView.style.display = "grid";
  }, 2000);
}

function renderModelAccuracyRow(data) {
  const modelAccuracyRow = document.createElement("div");
  modelAccuracyRow.className = "model-accuracy-wrapper";

  const modelTypeElement = document.createElement("div");
  modelTypeElement.className = "model-type";
  modelTypeElement.textContent = data.type;

  const modelNameElement = document.createElement("div");
  modelNameElement.className = "model-name";
  modelNameElement.textContent = data.filename;

  const accuracyElement = document.createElement("div");
  accuracyElement.className = "model-accuracy";
  accuracyElement.textContent = data.accuracy + "%";

  modelAccuracyRow.addEventListener("click", () => {
    // callback a new popup
  });

  modelAccuracyRow.appendChild(modelTypeElement);
  modelAccuracyRow.appendChild(modelNameElement);
  modelAccuracyRow.appendChild(accuracyElement);
  return modelAccuracyRow;
}

function roundUp(floatingDecimal) {
  return Math.round(floatingDecimal * 100) / 100;
}

// function handleChangePrediction(parameters) {
//   const loader = document.querySelector(".change-prediction-loader");
//   loader.style.display = "none";

//   const changePredicitionOverlay = document.querySelector(
//     ".change-prediction-overlay"
//   );

//   const currentPredictionPlaceholder = changePredicitionOverlay.querySelector(
//     ".current-prediction-placeholder"
//   );

//   const changeToOptions =
//     changePredicitionOverlay.querySelector(".change-to-options");
//   changeToOptions.innerHTML = "";

//   const comment = changePredicitionOverlay.querySelector(".comment");

//   const { id, result, options, imageName } = parameters;
//   currentPredictionPlaceholder.textContent = result;

//   const predictionChanges = { id, imageName };
//   globalCache.put("predictionChanges", predictionChanges);

//   options.forEach((option) => {
//     const changeOption = document.createElement("label");
//     changeOption.className = "change-option";

//     const changeOptionInput = document.createElement("input");
//     changeOptionInput.type = "radio";
//     changeOptionInput.name = "radio";
//     changeOptionInput.required = "true";

//     changeToOptions.addEventListener("change", (e) => {
//       if (e.target && e.target.type === "radio") {
//         const selectedOption = e.target.nextSibling.textContent.trim(); // Get the label text
//         console.log("Selected option:", selectedOption);
//         predictionChanges.result = selectedOption;
//       }
//     });

//     changeOption.appendChild(changeOptionInput);
//     changeOption.innerHTML += option;
//     changeToOptions.appendChild(changeOption);
//   });

//   comment.addEventListener("input", () => {
//     predictionChanges.comment = comment.textContent;
//     console.log("happening: ", predictionChanges);
//   });
// }
