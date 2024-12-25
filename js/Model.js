class Model {
  id;
  filename;
  featureInputSize;
  getPredictedResults = {
    status: "prediction never started",
  };
  
  loader = null;
  checkmark = null;
  loaderWaiting = null;

  constructor(
    { id, filename, featureInputSize, labelType },
    onEndCallback = () => {}
  ) {
    (this.id = id),
      (this.filename = filename),
      (this.labelType = labelType),
      (this.featureInputSize = featureInputSize);
    this.onEndCallback = onEndCallback;
  }

  async startPrediction(data) {
    const { selectedImage } = data;

    const formData = new FormData();
    formData.append("image", selectedImage);
    formData.append("featureInputSize", this.featureInputSize);
    formData.append("modelFilename", this.filename);
    formData.append("labelType", this.labelType);

    this.changeLoaders(this);

    try {
      const result = await this.getResultsFor(formData);
      this.predictedResults = result;
      return this.onEnd({ ...result, isError: "false" });
    } catch (error) {
      console.log(error);
      return this.onEnd({ error, isError: "true" });
    } finally {
      // Unreachable Code
    }
  }

  getPredictedResults() {
    return this.getPredictedResults;
  }

  onEnd(something = {}) {
    this.onEndCallback();
    return {
      id: this.id,
      filename: this.filename,
      featureInputSize: this.featureInputSize,
      ...something,
    };
  }

  changeLoaders() {
    console.log(this);
    this.loader ? this.loader.style.display = "grid" : false;
    this.checkmark ? this.checkmark.style.display = "none" : false;
    this.loaderWaiting ? this.loaderWaiting.style.display = "none" : false;
  }

  async getResultsFor(formData) {
    return new Promise(async (resolve, reject) => {
      let hostname = isProjectRunningLocally()
        ? "127.0.0.1:8013"
        : "braintumorapi.aiiot.center";
      console.log("hostname: ", hostname);
      let url = `https://${hostname}/predict`;

      let result = await fetch(url, {
        method: "POST",
        body: formData,
      });

      let JSONResult = await result.json();
      resolve(JSONResult);
    });
  }

  updateData() {
    let rowData = this.predictedResults;
    // const accuracy = roundUp(
    //   rowData.class_probabilities[rowData.predicted_class]
    // );

    // this.accuracyPlaceholder.textContent = accuracy + "%";
    this.resultPlaceholder.textContent = rowData.predicted_class;
    this.resultPlaceholder.style.display = "grid";

    this.loader.style.display = "none";
    this.checkmark.style.display = "grid";
    this.loaderWaiting.style.display = "none";
  }

  createModelRow() {
    let modelRow = document.createElement("div");
    modelRow.className = "model-row";
    modelRow.setAttribute("data-id", this.id);

    let modelRowName = document.createElement("div");
    modelRowName.className = "model-row-name";
    modelRowName.textContent = this.filename;

    let indicator = document.createElement("div");
    indicator.className = "indicator";
    indicator.style.display = "grid";

    let loaderWaiting = document.createElement("div");
    loaderWaiting.className = "loader-waiting";

    let loader = document.createElement("div");
    loader.className = "loader";
    loader.innerHTML = `        
        <span></span>
        <span></span>
        <span></span>
        <span></span>
    `;

    let checkmark = document.createElement("div");
    checkmark.className = "checkmark";
    checkmark.innerHTML = `<img src="assets/icons/check.png" alt="checkmark">`;

    indicator.append(loaderWaiting);
    indicator.append(loader);
    indicator.append(checkmark);

    this.loader = loader;
    this.checkmark = checkmark;
    this.loaderWaiting = loaderWaiting;

    let modelRowResult = document.createElement("div");
    modelRowResult.className = "model-row-result";
    this.resultPlaceholder = modelRowResult;

    let modelRowAccuracy = document.createElement("div");
    modelRowAccuracy.className = "model-row-accuracy";
    this.accuracyPlaceholder = modelRowAccuracy;

    modelRow.appendChild(modelRowName);
    modelRow.appendChild(modelRowResult);
    modelRow.appendChild(modelRowAccuracy);
    modelRow.append(indicator);

    modelRow.addEventListener("click", () => {});

    return modelRow;
  }
}

class ModelManager {
  id;
  models = [];
  results = [];
  flatResults = [];

  constructor(
    { models, image, parentContainer, title, miniTitle },
    callbackObject = null
  ) {
    this.id = uniqueID();
    this.models = models;
    this.image = image;
    this.title = title;
    this.miniTitle = miniTitle;
    this.parentContainer = parentContainer;
    this.createRenderingContainer();
    this.callbackObject = callbackObject;
  }

  createRenderingContainer() {
    //maybe wrap these

    const titleContainer = document.createElement("div");
    titleContainer.className = "title-container";

    const title = document.createElement("h2");
    title.className = "model-render-container-title";
    title.textContent = this.title;
    this.parentContainer.append(titleContainer);

    const text = document.createElement("div");
    text.className = "title-mini-text";
    text.textContent = this.miniTitle;
    titleContainer.append(title)
    titleContainer.append(text)

    this.miniTitlePlaceholder = text;

    const renderContainer = document.createElement("div");
    renderContainer.className = "render-container C" + this.id;
    this.renderContainer = renderContainer;
    this.parentContainer.append(renderContainer);
  }

  async predictWithAll() {
    this.models.forEach((model) => {
      const rowObject = model.createModelRow();
      this.renderContainer.append(rowObject);
    });

    for await (const model of this.models) {
      const result = await model.startPrediction({ selectedImage: this.image });
      this.results.push(result);
      this.flatResults.push(result.predicted_class);
      model.updateData();
    }

    if (this.onEnd != null) this.onEnd();
  }

  onEnd() {
    const { callback, ruleMajority } = this.callbackObject;
    if (this.calculateMajority(ruleMajority)) callback();
  }

  calculateMajority(rule) {
    // const mostFrequent = findMostFrequent(this.flatResults);

    const keywords = countKeywords(this.flatResults);

    if(keywords[rule] >= 2) return true;
    return false;

    // if(mostFrequent.keyword == rule) return true;
    // return false

    // if (this.flatResults.includes(rule)) return true;
    // return false;
  }
}

function countKeywords(values) {
  return values.reduce((acc, value) => {
    acc[value] = (acc[value] || 0) + 1; // Increment count for the keyword
    return acc;
  }, {}); // Start with an empty object
}

function findMostFrequent(values) {
  const counts = countKeywords(values); // Get the counts
  let maxKeyword = null;
  let maxCount = 0;

  for (const [keyword, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxKeyword = keyword;
      maxCount = count;
    }
  }

  return { keyword: maxKeyword, count: maxCount };
}
