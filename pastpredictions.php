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
</head>
<body>

    <!-- <div class="box">
        <img src="assets/logos/neu-logo.png" alt="">
    </div> -->

    <?php include "components/header.php" ?>
    <?php include "components/menu.php" ?>

    <div class="main-container normal-margin">

        <div class="mini-section-header">
            <h1>Predictions</h1>
        </div>

        <div class="predictions-container">
        </div>

        <!-- TODO: pagination -->

    </div>

    <script>

        renderPredictions();

        async function getPredictions(){

            globalCache.put("userID", "3333434") //TODO: Fix

            let userID = globalCache.get('userID');
            console.log("userID: ", userID);

            return await AJAXCall({
                type: "fetch",
                phpFilePath: "../include/getAllPersonalPredictions.php",
                rejectMessage: "Getting Past Predictions Failed",
                params: `userID=3333434`
            })

        }

        async function renderPredictions(){

            const predictionsContainer = document.querySelector(".predictions-container");
            predictionsContainer.innerHTML = "";

            // console.log(renderEmptyLoader());
            // predictionsContainer.innerHTML += renderEmptyLoader()

            let data = await getPredictions();

            console.log("data: ", data);

            predictionsContainer.innerHTML = "";

            setTimeout(() => {
                data.forEach( pastPredictionData => {
                    const predictionElementContainer = renderPredictionElementContainer(pastPredictionData);
                    predictionsContainer.append(predictionElementContainer);
                })
            }, 0)

        }
    </script>

    <?php include "components/predictionViewOverlay.php" ?>


    </body>
</html>