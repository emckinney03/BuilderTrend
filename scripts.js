
document.getElementById("Filterbtn").onclick = function () {
   
    //the available options for user to select
    let status, minPrice, maxPrice, minSize, maxSize, bath, garage, community, floorPlan;
    status    = document.getElementById("status-select");
    minPrice  = document.getElementById("minPrice-select");
    maxPrice  = document.getElementById("maxPrice-select");
    minSize   = document.getElementById("minSize-select");
    maxSize   = document.getElementById("maxSize-select");
    beds      = document.getElementById("beds-select");
    baths     = document.getElementById("baths-select");
    garages   = document.getElementById("garages-select");
    community = document.getElementById("community-select");
    floorPlan = document.getElementById("floorPlan-select");
    
    //<option value>Text</option>
    let minPriceValue = Number(minPrice.value);
    let maxPriceValue = Number(maxPrice.value);
    let minSizeValue = Number(minSize.value);
    let maxSizeValue = Number(maxSize.value);
    let bedValue = Number(beds.value);
    let bathValue = Number(baths.value);
    let garageValue = Number(garages.value);

    let statusValue = Number(status.value);
    let commValue = Number(community.value);
    let floorPlanValue = Number(floorPlan.value);
    
    let statusText    = status.options[status.selectedIndex].text;
    let commText      = community.options[community.selectedIndex].text;
    let floorPlanText = floorPlan.options[floorPlan.selectedIndex].text;
    
    //number-really big and really small - in case either end (min/max) wasn't selected
    dmAPI.loadCollectionsAPI().then(api => {
        api.data("All properties")
        //initial comparision of available options
        //if we compare using status here and status is -1 then nothing will return
        .where("Bedrooms", "GTE", bedValue)
        .where("Bathrooms", "GTE", bathValue)
        .where("Garages", "GTE", garageValue)
        .where("Price", "BTWN", [minPriceValue, maxPriceValue])
        .where("Size", "BTWN", [minSizeValue, maxSizeValue])
        .select("background_image", "address", "Status", "Price", "Size", "Bedrooms", "Bathrooms", "Garages", "Community", "floorPlan")
        .get()
        .then(json => {
            var img_list = document.getElementById("img_list");
            for (let object of json.values) {
                //filter the results using remaining available options
                //any value other than -1 means that user selected something
                //the image isn't valid if its text differs from user selected value
                let valid = true;
                if (statusValue != -1 && object.data.status != statusText) {
                    valid = false;
                }
                if (commValue != -1 && object.data.community != commText) {
                    valid = false;
                }
                if (floorPlanValue != -1 && object.data.floor_plan == floorPlanText) {
                    valid = false;
                }
                if (valid) {
                    let x = object.data.background_image;
                    img_list.innerHTML += "<img src=\"" + x + "\" alt=\"\" width=\"200\" height=\"200\">";
                }
            }
        })
    })  
    
}
