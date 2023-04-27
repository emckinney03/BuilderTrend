/**
 * Description
 * @param {any} "Filterbtn"
 * @returns {any}
 */

//connect btn to options - DONE
//need to connect this to collections api
//need to figure a way to delete image widgets and create new ones for filter result
//or replace images in all image widget with filter result

document.getElementById("Filterbtn").onclick = function () {
    
    dmAPI.loadCollectionsAPI()
        .then(function(colAPI) {
            return colAPI.data("All properties").where("Price", "EQ", 10).get();
        })
        .then(function(values) {
            console.log(values)
        })
        
    // dmAPI.loadCollectionsAPI().then(api => {
    // api.data("All properties")
    //     .where("Price", "EQ", "$490,000")
    //     .get()
    //     .then(json => console.log(json))
    // })
    let status, minPrice, maxPrice, minSize, maxSize, bed, bath, garage, community, floorPlan;
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
    //let value = test.value;
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
    
    console.log("hi " + statusText);
}
