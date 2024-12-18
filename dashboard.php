<?php

    session_start();
    $id = isset($_SESSION['id']);
    $username = isset($_SESSION['username']);

    if(!$username){ header('location:index.html'); }

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>

    <?php include "include/userDynamicImports.php" ?>

    <link rel="stylesheet" href="css/root.css?29249424242424">
</head>
<body>

    <!-- <div class="box">
        <img src="assets/logos/neu-logo.png" alt="">
    </div> -->

    <?php include "components/header.php" ?>
    <?php include "components/menu.php" ?>

    <div class="main-container">

        <div class="predict-button-container">
            <div class="button" onclick="handlePredictContainerView()">Perform Brain Tumor Prediction</div>
        </div>

        <!-- <div class="mini-section">

            <div class="mini-section-header">
                <h2>Recent Predictions</h2>

                <div class="arrow-link">
                    <a href="pastpredictions.php">View All Predictions</a>
                    <p>→</p>
                </div>
            </div>

            <div class="past-predictions-container">
            </div>
        </div> -->

        <div class="mini-section">

            <div class="mini-section-header">
                <h2>Model Accuracies</h2>

                <div class="arrow-link">
                    <a href="models.php">View All Available Models</a>
                    <p>→</p>
                </div>
            </div>

            <div class="model-accuracies-container">
            </div>
        
        </div>

    </div>


    <script>

        renderModelAccuracies();
        // renderPastPredictions();

        async function renderModelAccuracies(){

            let models = await getAllMulticlassModels();
            const modelAccuracyContainer = document.querySelector(".model-accuracies-container");

            models.forEach( model => {
                let row = renderModelAccuracyRow(model);
                modelAccuracyContainer.appendChild(row);
            })

            models = await getAllBinaryModels();
            // const modelAccuracyContainer = document.querySelector(".model-accuracies-container");

            models.forEach( model => {
                let row = renderModelAccuracyRow(model);
                modelAccuracyContainer.appendChild(row);
            })

        }

        async function getTopModelAccuracies(){
            return await AJAXCall({
                type: "fetch",
                phpFilePath: "../include/getTopModelAccuracies.php",
                rejectMessage: "Getting Models Failed",
           })
        }

        async function getPastPredictions(){

            globalCache.put("userID", "3333434") //TODO: Fix
            
            let userID = globalCache.get('userID');
            console.log("userID: ", userID);

           return await AJAXCall({
            type: "fetch",
            phpFilePath: "../include/getPersonalPredictions.php",
            rejectMessage: "Getting Past Predictions Failed",
            params: `userID=3333434`
           })

        }

        function repeat(anything, times = 1){
            for (let i = 0; i < times; i++) {
                anything()
            }
        }

        async function renderPastPredictions(){

            const pastPredictionsContainer = document.querySelector(".past-predictions-container");
            pastPredictionsContainer.innerHTML = "";

            let data = await getPastPredictions();

            console.log("data: ", data);

            pastPredictionsContainer.innerHTML = "";
            
            setTimeout(() => {
                data.forEach( pastPredictionData => {
                    const predictionElementContainer = renderPredictionElementContainer(pastPredictionData);
                    pastPredictionsContainer.append(predictionElementContainer);
                })
            }, 0)

        }

        function renderEmptyLoader(){

            const predictionElementContainer = document.createElement("div");
            predictionElementContainer.className = "prediction-element-container";

            const loader = `
                <div class="loader-view predict-loader">
                    <div>
                        <div class="sk-grid">
                            <div class="sk-grid-cube"></div>
                            <div class="sk-grid-cube"></div>
                            <div class="sk-grid-cube"></div>
                            <div class="sk-grid-cube"></div>
                            <div class="sk-grid-cube"></div>
                            <div class="sk-grid-cube"></div>
                            <div class="sk-grid-cube"></div>
                            <div class="sk-grid-cube"></div>
                            <div class="sk-grid-cube"></div>
                            </div>
                    </div>
                </div>
            `;

            predictionElementContainer.innerHTML = loader;

            return predictionElementContainer;

            }

    </script>

  
    <?php include "components/predictionOverlay.php" ?>
    <?php include "components/predictionViewOverlay.php" ?>
    <?php include "components/asyncPredictionOverlay.php" ?>
</body>
</html>