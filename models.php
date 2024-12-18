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

    <?php include "components/header.php" ?>
    <?php include "components/menu.php" ?>

    <div class="main-container normal-margin">

        <div class="mini-section-header">
            <h1>Models</h1>
        </div>

        <div class="models-container">
            <div class="mini-container">
                <div class="mini-section-header">
                    <h2>CNN</h2>
                </div>

                <div class="cnn-model-container accuracy-container">
                    
                </div>
            </div>
        </div>


        <script>

            renderModelAccuracies();

            async function renderModelAccuracies(){

                let models = await getAllModelAccuracies();
                // const VGG16Container = document.querySelector(".vgg16-model-container");
                // const RESNET50Container = document.querySelector(".resnet50-model-container");
                const CNNContainer = document.querySelector(".cnn-model-container");
                // const InceptionV3Container = document.querySelector(".inceptionv3-model-container");

                models.forEach( model => {
                    let row = renderModelAccuracyRow(model);

                    switch(model.type.toLowerCase()){
                        // case "vgg16":
                        //     VGG16Container.appendChild(row);
                        // break;
                        // case "rsnt50":
                        //     RESNET50Container.appendChild(row);
                        // break;
                        case "cnn":
                            CNNContainer.appendChild(row);
                        break;
                        // case "incpv3":
                        //     InceptionV3Container.appendChild(row);
                        // break;
                    }
                })

            }

            async function getAllModelAccuracies(){
                return await AJAXCall({
                    type: "fetch",
                    phpFilePath: "../include/getAllModelAccuracies.php",
                    rejectMessage: "Getting Models Failed",
                })
            }

        </script>

    </div>
    </body>
</html>