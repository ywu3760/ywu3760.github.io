function initialize(){
	console.log("To remove all traces of items sent to the shopping cart, pls do:\nlocalStorage.clear();");
	
	// TEXT FITTING WITH ONLINE-SOURCED jquery.fittext.js ******************************************************************
	$(".review-log-othersBox-review-name").fitText(0.6);
	$(".review-log-othersBox-review-statement").fitText(0.8);
	$(".product-purchase-tags-title").fitText(1);
	$("#productName").fitText(1.2);
	$("#productPrice").fitText(1.2);
	$("#product-purchase-quantity").fitText(0.2);
	$(".product-purchase-purchaseBtn").fitText(0.4);
	$("#shoppingListBoxTitles td").css("font-size","calc(10vw / 6)");
	$("#shoppingListBoxTotal td").css("font-size","calc(10vw / 6)");
	$(".product-purchase-shoppingList-header-title").css("font-size","calc(10vw / 4)");
	$(".product-purchase-cart").fitText(1.2);
	$(".review-log-title").fitText(3);
	$(".review-unlock-title").fitText(3);
	$(".related-title").fitText(3);
	
	if (!localStorage.getItem("shoppingList")){
		shoppingList = [];
		var TEMPshoppingList = [];
		localStorage.setItem("shoppingList",shoppingList);
	} else {
		var TEMPshoppingList = localStorage.getItem("shoppingList").split(",");
	}
	if (TEMPshoppingList.length > 0){
		shoppingList = [];
		for (var index=0; index<(TEMPshoppingList.length)/2; index++) {
			shoppingList.push([0,0]);
			shoppingList[index][0] = parseInt(TEMPshoppingList[index*2]);
			shoppingList[index][1] = parseInt(TEMPshoppingList[(index*2) + 1]);
		}
		productNumber = shoppingList[shoppingList.length - 1][0];
	} else {
		shoppingList = [];
		productNumber = getRandomInteger(0,products.length - 1);
	}
	if (localStorage.getItem("reviews")){
		var TEMPreviews = localStorage.getItem("reviews").split(",");
		reviews = [];
		for (var index=0; index<(TEMPreviews.length)/3; index++) {
			reviews.push(
				{
					product: TEMPreviews[index*3],
					name: TEMPreviews[(index*3)+1],
					statement: TEMPreviews[(index*3)+2]
				}
			);
		}
	} else {
		uploadReviewsToStorage();
	}
	updateProduct(productNumber);
}

function uploadReviewsToStorage(){
	var reviewString = [];
	for (var index=0; index<reviews.length; index++) {
		var reviewPacket = [reviews[index].product,reviews[index].name,reviews[index].statement];
		reviewString.push(reviewPacket.join(","));
	}
	localStorage.setItem("reviews",reviewString.join(","));
}

function getRandomInteger(lower,upper){
	var multiplier = upper - (lower - 1);
	var rnd = parseInt(Math.random() * multiplier) + lower;
	return(rnd);
}

function displayProduct(productID){
	var productTarget = products[productID];
	$("#product-details-image").attr('src',productTarget.photo);
	$("#product-details-description").html('Description:<br />' + productTarget.description);
	$("#productName").html(productTarget.name);
	$("#productPrice").html("$" + productTarget.price);
}

/*sourced from stackoverflow*/
function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}
/*sourced from stackoverflow*/

function assignRelatedProducts(productID){
	relatedProdctIDs = [];
	var tagsOfProduct = products[productID].tag.split(";");
	for (var tagID=0; tagID<tagsOfProduct.length; tagID++){
		for (var currentID=0; currentID<products.length; currentID++){
			var comparisonTags = products[currentID].tag.split(";");
			if (currentID != productID && comparisonTags.includes(tagsOfProduct[tagID]) && !relatedProdctIDs.includes(currentID)){
				relatedProdctIDs.push(currentID);
			}
		}
	}
	if (relatedProdctIDs.length < 3){
		var remainingIDs = [];
		for (var index=0; index<products.length; index++){
			if (!relatedProdctIDs.includes(index)){
				remainingIDs.push(index);
			}
		}
		var requirement = 4-relatedProdctIDs.length;
		for (var addition=1; addition<requirement; addition++){
			var randomIndex = remainingIDs[getRandomInteger(0,remainingIDs.length - 1)];
			remainingIDs.splice(randomIndex, 1);
			relatedProdctIDs.push(randomIndex);
		}
	}
	shuffle(relatedProdctIDs);
	focusIndex = 1;
}

function shiftRelatedProductFocus(modifier){
	focusIndex+= modifier;
	$(".related-product-img").fadeOut("fast",function(){
		for (var index=0; index<3; index++){
			var destination = index-1+focusIndex;
			if (destination<0){destination+= relatedProdctIDs.length;}
			if (destination == relatedProdctIDs.length){destination-= relatedProdctIDs.length;}
			$('#relatedProduct' + index).attr('src',products[relatedProdctIDs[destination]].photo);
			$('#relatedProduct' + index).attr('onclick',"updateProduct(" + relatedProdctIDs[destination] + ");");
		}
		$(".related-product-img").fadeIn("fast");
	});
	if (focusIndex<0){focusIndex = relatedProdctIDs.length-1;}
	if (focusIndex>(relatedProdctIDs.length-1)){focusIndex = 0;}
}

function generateRelatedReviews(productID){
	relatedReviewIDs = [];
	var userReviewIDs = [];
	for (var reviewID=0; reviewID<reviews.length; reviewID++){
		if (reviews[reviewID].product == "generic" || reviews[reviewID].product == productID){
			if (reviews[reviewID].product == productID){
				userReviewIDs.push(reviewID);
			} else {
				relatedReviewIDs.push(reviewID);
			}
		}
	}
	shuffle(relatedReviewIDs);
	if (userReviewIDs.length > 0){
		shuffle(userReviewIDs);
		for (var index=0; index<userReviewIDs.length; index++){
			relatedReviewIDs.unshift(userReviewIDs[index]);
		}
	}
	reviewFocus = 1;
}
	
function shiftProductReviewFocus(modifier){
	reviewFocus+= modifier;
	$(".review-log-othersBox-review").fadeOut("fast",function(){
		for (var index=0; index<3; index++){
			var destination = index-1+reviewFocus;
			if (destination<0){destination+= relatedReviewIDs.length;}
			if (destination == relatedReviewIDs.length){destination-= relatedReviewIDs.length;}
			$('#reviewLog' + index + 'Name').html(reviews[relatedReviewIDs[destination]].name);
			$('#reviewLog' + index + 'Opinion').html(reviews[relatedReviewIDs[destination]].statement);
		}
		$(".review-log-othersBox-review").fadeIn("fast");
	});
	if (reviewFocus<0){reviewFocus = relatedReviewIDs.length-1;}
	if (reviewFocus>(relatedReviewIDs.length-1)){reviewFocus = 0;}
}

function launchUserReview(){
	if ($('#reviewName').val().length >= 3){
		if ($('#reviewCode').val() == products[productNumber].review){ 
			$('#review-unlock').css('display','none');
			$('#review-unlock-content').css('display','block');
			$('#review-user-span-name').html($('#reviewName').val());
		} else {
			$('#invalidReviewCode-cover').css('display','block');
		}
	} else {
		$('#invalidReviewName-cover').css('display','block');
	}
}

function addItemToCart(){
	var comparisonValue = parseInt($('#product-purchase-quantity').val());
	if (Number.isInteger(comparisonValue) && comparisonValue > 0 && comparisonValue < 6 && comparisonValue%1 == 0){
		// shoppingList[[productId,qt],[..,..]]
		var listContainProduct = false;
		for (var shoppingIndex=0; shoppingIndex<shoppingList.length; shoppingIndex++){
			if (shoppingList[shoppingIndex][0] == productNumber){
				listContainProduct = true;
				var existingIndex = shoppingIndex;
				break;
			}
		}
		if (!listContainProduct){
			shoppingList.push([productNumber,comparisonValue]);
		} else {
			shoppingList[existingIndex][1]+= comparisonValue;
			if (shoppingList[existingIndex][1]>5){shoppingList[existingIndex][1] = 5;}
		}
		localStorage.setItem("shoppingList",shoppingList);
		displayShoppingList();
	} else {
		$('#invalidCartAdd-cover').css('display','block');
	}
}

function displayShoppingList(){
	$("#shoppingListBoxItems tr").remove();
	var totalPrice = 0;
	for (var productTarget=0; productTarget<shoppingList.length; productTarget++){
		var itemName = products[shoppingList[productTarget][0]].name;
		if (itemName.length>15){
			itemName = itemName.slice(0,15) + "...";
		}
		var quantity = "x" + shoppingList[productTarget][1];
		var priceTag = (shoppingList[productTarget][1] * products[shoppingList[productTarget][0]].price).toFixed(2);
		totalPrice+= parseFloat(priceTag);
		if (priceTag.toString().length < 5){priceTag = "0" + priceTag.toString();}
		$("#shoppingListBoxItems").append($('<tr>')
			.append($('<td>')
				.text(itemName)
				.css("font-size","calc(10vw / 5)")
			)
			.append($('<td>')
				.text(quantity)
				.css("font-size","calc(10vw / 5)")
			)
			.append($('<td>')
				.text(priceTag)
				.css("font-size","calc(10vw / 5)")
			)
			.attr('onmouseenter','$(this).css("background-color","red");')
			.attr('onmouseleave','displayShoppingList();')
			.attr('id',productTarget)
			.attr('onclick','targetID = this.id;$("#purchaseDelete-cover").css("display","block");')
		);
	}
	totalPrice = totalPrice.toFixed(2);
	if (totalPrice.toString().length < 5){totalPrice = "0" + totalPrice.toString();}
	$('#shoppingTotalPrice').html("$" + totalPrice);
}

function sendUserReview(){
	if ($('.review-user-text').val().length >= 20){
		products[productNumber].review = "null";
		reviews.push(
			{
				product: productNumber,
				name: $('#reviewName').val(),
				statement: $('.review-user-text').val()
			}
		);
		uploadReviewsToStorage();
		checkForReviewEligbility(productNumber);
		generateRelatedReviews(productNumber);
		shiftProductReviewFocus(0);
	} else {
		$('#invalidReviewSubmission-cover').css('display','block');
	}
}

function checkForReviewEligbility(productID){
	var userReviewed = false;
	for (var index=0; index<reviews.length; index++){
		if (reviews[index].product == productID){
			userReviewed = true;
			break;
		}
	}
	if (userReviewed){
		if ($('#review-unlock').css('display') != "none" || $('#review-unlock-content').css('display') != "none"){
			$('#review-unlock').fadeOut('slow');
			$('#review-unlock-content').fadeOut('slow');
		}
	} else {
		$('#review-unlock').fadeIn('slow');
		$('#review-unlock-content').fadeOut('slow');
	}
}

function purchaseCart(){
	if (shoppingList.length > 0){
		$('#purchaseSubmission-cover').find('.infoBox-text').html("Are you sure you want to purchase the selected items. If you press YES, we will charge from your internet bill by a total of " +  $('#shoppingTotalPrice').html() + ". If you press NO, you will be directed back to make changes.");
		$('#purchaseSubmission-cover').css('display','block');
	} else {
		$('#invalidPurchaseSubmission-cover').css('display','block');
	}
}

function purchaseConfirmedProcdeures(){
	for (var itemIndex=0; itemIndex<shoppingList.length; itemIndex++){
		if (products[shoppingList[itemIndex][0]].review == "null"){
			var digit1 = getRandomInteger(1,9).toString();
			var digit2 = getRandomInteger(1,9).toString();
			var digit3 = getRandomInteger(1,9).toString();
			var digit4 = getRandomInteger(1,9).toString();
			var digit5 = getRandomInteger(1,9).toString();
			products[shoppingList[itemIndex][0]].review = digit1.concat(digit2,digit3,digit4,digit5);
		}
	}
	shoppingList = [];
	localStorage.setItem("shoppingList",shoppingList);
	displayShoppingList();
	$('#purchaseThanks-cover').css('display','block');
	fillInReviewCodes();
}

function fillInReviewCodes(){
	var userReviewed = [];
	for (var index=0; index<products.length; index++){
		if (products[index].review != "null"){userReviewed.push(index);}
	}
	if (userReviewed.includes(productNumber)){
		$('#reviewCode').val(products[userReviewed[userReviewed.indexOf(productNumber)]].review);
		$('#reviewCode').attr('readonly',true);
	} else {
		$('#reviewCode').attr('readonly',false);
	}
}

function updateProduct(productID){
	productNumber = productID;
	window.scrollTo(0,0);
	displayProduct(productID);
	assignRelatedProducts(productID);
	shiftRelatedProductFocus(0);
	generateRelatedReviews(productID);
	shiftProductReviewFocus(0);
	displayShoppingList();
	checkForReviewEligbility(productID);
	$('#review-unlock').css('display','block');
	$('#review-unlock-content').css('display','none');
	$('#reviewName').val('');
	$('#reviewCode').val('');
	$('#product-purchase-quantity').val('');
	fillInReviewCodes();
}