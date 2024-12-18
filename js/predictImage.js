async function handlePredictingImageChange(event) {
  let file = event.target.files[0];

  let previewIMG = document.querySelector(".image-predict-chosen-preview");

  previewIMG.zIndex = 2;

  loadImage(file, ".image-predict-chosen-preview");
  globalCache.put("hasImageBeenSelected", true);
  globalCache.put("selectedImageForPrediction", file);

  const button = document.querySelector(
    ".prediction-overlay .popup-footer .button"
  );
  const buttonLoader = button.querySelector(".button-loader");
  const buttonText = document.querySelector(".button-text");
  buttonLoader.style.display = "grid";
  buttonText.style.display = "none";

  button.setAttribute("disabled", "true");

  try {
    const result = await checkIfImageIsMRI();
    console.log("is image MRI: ", result);
    setTimeout(() => handlePredictButtonLogic(result.predicted_class), 1000);
  } catch (error) {
    console.log(error);
  }
}

function handlePredictButtonLogic(logic = "no-upload") {
  const button = document.querySelector(
    ".prediction-overlay .popup-footer .button"
  );
  const buttonLoader = button.querySelector(".button-loader");
  const buttonText = button.querySelector(".button-text");
  console.log(buttonText);

  buttonLoader.style.display = "none";
  buttonText.style.display = "grid";

  switch (logic) {
    case "mri":
      buttonText.textContent = "start prediction";
      button.removeAttribute("disabled");
      break;
    case "non-mri":
      buttonText.textContent = "non-mri image detected";
      button.setAttribute("disabled", "true");
      break;
    case "no-upload":
      buttonText.textContent = "select an mri image first";
      button.removeAttribute("disabled");
    default:
      break;
  }
}

function resetPredictionOverlay() {
  document.querySelector(".image-predict-chosen-preview").src = "";
  globalCache.put("hasImageBeenSelected", false);
  globalCache.put("selectedImageForPrediction", null);
}

async function checkIfImageIsMRI() {
  const selectedImage = globalCache.get("selectedImageForPrediction");
  const hasImageBeenSelected = globalCache.get("hasImageBeenSelected");

  if (!hasImageBeenSelected) {
    //TODO:  showSelectImageToast();
    console.log("Image has not been selected");
    return;
  }

  const customCNNModel = {
    name: "CustomCNN MRINONMRI",
    id: "CustomCNNModelA100",
    filename: "CNNMRINONMRI-15EP.keras",
    featureInputSize: 224,
    labelType: "uploadscan",
  };

  const MRINONMRIMODEL = new Model(customCNNModel);
  return await MRINONMRIMODEL.startPrediction({ selectedImage });
}

async function startPrediction() {
  const selectedImage = globalCache.get("selectedImageForPrediction");
  const hasImageBeenSelected = globalCache.get("hasImageBeenSelected");

  openPopup(".async-prediction-overlay");

  if (!hasImageBeenSelected) {
    //TODO:  showSelectImageToast();
    console.log("Image has not been selected");
    return;
  }

  try {
    //TODO: Uploading Images Doesn't Work ??? On Chrome Dev
    let fileUploadResult = await uploadFile(selectedImage);
    let { newFileName: imageName, fileSize } = fileUploadResult;
    let domain = getDomain();
    console.log(domain);

    let data = {
      selectedImage,
      domain,
    };

    const availableBinaryModels = getAllBinaryModels();
    const binaryModels = [];
    availableBinaryModels.forEach((model) =>
      binaryModels.push(new Model(model))
    );

    const callBackObject = {
      callback: () => runMulticlassManager(selectedImage),
      ruleMajority: "yes",
    };

    const parentContainer = document.querySelector(
      ".model-rendering-parent-container"
    );

    parentContainer.innerHTML = "";

    const binaryModelManager = new ModelManager(
      {
        models: binaryModels,
        image: selectedImage,
        parentContainer,
        title: "Binary Predictions",
        miniTitle: "( minimum 2 yes results )"
      },
      callBackObject
    );
    binaryModelManager.predictWithAll();

    // let parameters = {
    //   id: uniqueID(1),
    //   userID: "3333434",
    //   date: getCurrentTimeInJSONFormat(),
    //   modelID,
    //   result: tickPredictionResult.predicted_class,
    //   imageName,
    //   fileSize,
    // };

    // let params = createParamatersFrom(parameters);

    // console.log("params to save to database: ", params);

    // await uploadPredictionToDatabase(params);

    // closePopup(".overlay.prediction-overlay");

    // await handlePredictionReview({
    //   ...parameters,
    //   ...currentChosenModel,
    //   ...tickPredictionResult,
    // });
  } catch (error) {
    console.log(error);
  }
}

// async function confirmPredictionChanges(e) {
//   e.preventDefault();
//   const loader = document.querySelector(".change-prediction-loader");
//   loader.style.display = "grid";

//   const predictionChanges = globalCache.get("predictionChanges");
//   if (predictionChanges.comment && predictionChanges.comment.length < 1)
//     predictionChanges.comment = "None";

//   let params = createParamatersFrom(predictionChanges);

//   if (predictionChanges) {
//     try {
//       await AJAXCall({
//         phpFilePath: "../include/changePrediction.php",
//         rejectMessage: "Changing Prediction Failed",
//         params,
//         type: "post",
//       });

//       // move file
//       await AJAXCall({
//         phpFilePath: "../include/copyFile.php",
//         rejectMessage: "Copy File Failed",
//         params: createParamatersFrom({
//           imageName: predictionChanges.imageName,
//           uploadFolderPath: "../uploads/",
//           newFolderName: predictionChanges.result,
//         }),
//         type: "post",
//       });
//     } catch (error) {
//       console.log("move file error: ", error);
//     } finally {
//       setTimeout(() => {
//         loader.style.display = "grid";
//         closePopup(".change-prediction-overlay");
//         changePredictionValue(predictionChanges.result);
//       }, 1000);
//     }
//   }
// }

function isProjectRunningLocally() {
  let currentURL = new URL(window.location.href);
  return currentURL.hostname == "localhost" ? true : false;
}

async function uploadPredictionToDatabase(params) {
  try {
    let result = await AJAXCall({
      phpFilePath: "../include/savePrediction.php",
      rejectMessage: "Saving Prediction Failed",
      params,
      type: "post",
    });

    console.log(result);
  } catch (error) {
    console.log(error);
  }
}

// TODO:

// 1. Check if image is MRI Non MRI
// 2. new popup
// 3. create class to predict many models asynchronously
// 4. list binary models and results
// 5. list multiclass models and results

function runMulticlassManager(image) {
  const availableMulticlassModels = getAllMulticlassModels();
  const multiclassModels = [];

  availableMulticlassModels.forEach((model) =>
    multiclassModels.push(new Model(model))
  );

  const parentContainer = document.querySelector(
    ".model-rendering-parent-container"
  );

  const multiclassModelManager = new ModelManager({
    models: multiclassModels,
    image,
    parentContainer,
    title: "Multiclass Predictions",
    miniTitle: "",
  });

  multiclassModelManager.predictWithAll();
}

function getAllBinaryModels() {
  return [
    {
      name: "CustomCNN",
      id: "CustomCNNB100",
      filename: "B_CustomCNN_30EP.keras",
      featureInputSize: 224,
      labelType: "binary",
      type: "Custom CNN",
      accuracy: "97.17",
    },
    {
      name: "ResNet18",
      id: "ResNet18B100",
      filename: "B_ResNet18_30EP.keras",
      featureInputSize: 224,
      labelType: "binary",
      type: "ResNet",
      accuracy: "98.83",
    },
    {
      name: "ResNet50",
      id: "ResNet50A100",
      filename: "B_Resnet50-30EP.keras",
      featureInputSize: 224,
      labelType: "binary",
      type: "ResNet",
      accuracy: "87.37",
    },
    {
      name: "MobileNet",
      id: "MobileNetA100",
      filename: "B_MobileNet-30EP.keras",
      featureInputSize: 224,
      labelType: "binary",
      type: "MobileNet",
      accuracy: "98.00",
    },
    {
      name: "EfficientNet-B0",
      id: "EfficientNetB100",
      filename: "B_EfficientNet_B0_30.keras",
      featureInputSize: 224,
      labelType: "binary",
      type: "EfficientNet",
      accuracy: "98.17",
    },
    {
      name: "DenseNet121",
      id: "DenseNet121B100",
      filename: "B_DenseNet121-30EP.keras",
      featureInputSize: 224,
      labelType: "binary",
      type: "DenseNet",
      accuracy: "98.00",
    },
  ];
}

function getAllMulticlassModels() {
  return [
    {
      name: "CustomCNN",
      id: "CustomCNNA100",
      filename: "A_CustomCNN_30EP.keras",
      featureInputSize: 224,
      labelType: "multiclass",
      type: "Custom CNN",
      accuracy: "76.26",
    },
    {
      name: "Resnet18",
      id: "Resnet18A100",
      filename: "A_ResNet18_30EP.keras",
      featureInputSize: 224,
      labelType: "multiclass",
      type: "ResNet",
      accuracy: "92.42",
    },
    {
      name: "MobileNet",
      id: "MobileNetA100",
      filename: "A_MobileNet-30EP.keras",
      featureInputSize: 224,
      labelType: "multiclass",
      type: "MobileNet",
      accuracy: "92.23",
    },
    {
      name: "DenseNet121",
      id: "DenseNet121A100",
      filename: "A_DenseNet121-30EP.keras",
      featureInputSize: 224,
      labelType: "multiclass",
      type: "DenseNet",
      accuracy: "92.93",
    },
    {
      name: "Resnet50",
      id: "Resnet50A100",
      filename: "A_Resnet50-30EP.keras",
      featureInputSize: 224,
      labelType: "multiclass",
      type: "ResNet",
      accuracy: "87.37",
    },
    {
      name: "EfficientNet-B0",
      id: "EfficientNetA100",
      filename: "A_EfficientNet_B0_30.keras",
      featureInputSize: 224,
      labelType: "multiclass",
      type: "EfficientNet",
      accuracy: "87.88",
    },
  ];
}
