
//connect btn to options - DONE
//need to connect this to collections api
//need to figure a way to delete image widgets and create new ones for filter result
//or replace images in all image widget with filter result

document.getElementById("Filterbtn").onclick = function () {
    
    // dmAPI.loadCollectionsAPI()
    //     .then(function(colAPI) {
    //         //let collection - variable
    //         //collection.price
    //         let collection = colAPI.data("All properties").where("Price", "EQ", "$690, 000").get();
    //         let newC = collection.where("id_test", "LT", "10").get();
    //     })
    //     .then(function(values) {
    //         console.log(values)
    //     })
    
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
    //let test = document.getElementById("floor_plan-select");
    let x = Number(beds.value);
    console.log(x);
    //let text = test.options[test.selectedIndex].text;
    let statusText, minText, maxText, minSizeText, maxSizeText, bedText, bathText, garageText, commText, planText;
    statusText    = status.options[status.selectedIndex].text;
    minPriceText  = minPrice.options[minPrice.selectedIndex].text;
    maxPriceText  = maxPrice.options[maxPrice.selectedIndex].text;
    minSizeText   = minSize.options[minSize.selectedIndex].text;
    maxSizeText   = maxSize.options[maxSize.selectedIndex].text;
    bedText       = beds.options[beds.selectedIndex].text;
    bathText      = baths.options[baths.selectedIndex].text;
    garageText    = garages.options[garages.selectedIndex].text;
    commText      = community.options[community.selectedIndex].text;
    floorPlanText = floorPlan.options[floorPlan.selectedIndex].text;
    

    let collection = dmAPI.loadCollectionsAPI().then(api => {
    return api.data("All properties")
        .where("Bedrooms", "GT", x)
        .where("id_test", "LT", 5)
        .get()
    }).then(function(values) {
        console.log(values);
    })
    console.log("here:", collection);
    console.log("hi " + statusText);
}
