var test="aaa";

var HEIGHT = 400;
var WIDTH = 400;




function load_puzzle_images(imgs_path, ROWS, COLUMNS) {

	var HEIGHT = 400;
	var WIDTH = 400;
	var puzzle_container=document.createElement("div");
	puzzle_container.id="puzzle_container";
	var puzzle_container_css=`

		background-color: gray;
		display: grid;
		grid-gap: 2px;
		grid-template-columns: repeat(${COLUMNS}, ${WIDTH/COLUMNS}px);
	  	grid-template-rows: repeat(${ROWS}, ${HEIGHT/ROWS}px);
	
	 `;

	 puzzle_container.style.cssText = puzzle_container_css;

	

	for( x in imgs_path ){
		
		var img_slice_container = document.createElement("div");

		var img_slice = document.createElement("img");

		img_slice_container.style.width = `${ WIDTH  / COLUMNS}px`;
		img_slice_container.style.height = `${ HEIGHT / ROWS}px`;
		img_slice.width = `${ WIDTH  / COLUMNS}`;
		img_slice.height = `${ HEIGHT / ROWS}`;
										// imgs_path[x][0] contains row index, imgs_path[x][1] containx column index
		img_slice_container.style = `grid-area:  ${parseInt(imgs_path[x][0])+1}/${parseInt(imgs_path[x][1])+1}`;
					  //imgs_path[x][2] contains path 
		img_slice.src=imgs_path[x][2];

		img_slice.id= imgs_path[x][2];

		img_slice_container.appendChild(img_slice);

		//make the image draggeable
		img_slice_container.draggable="true";
		img_slice_container.addEventListener('dragstart', swap_img_drag);
		img_slice_container.addEventListener("dragover", function(event) {
			event.preventDefault();
		  });
		img_slice_container.addEventListener('drop', swap_img_drop);


	
		puzzle_container.appendChild(img_slice_container);
	}
	
	//scramble the puzzle
	scramble_puzzle(puzzle_container,ROWS,COLUMNS);



}

function swap_img_drag(ev) {
	//transfer the grid indexes
    ev.dataTransfer.setData("id", ev.target.id );
	

} 

function swap_img_drop(ev) {

	ev.preventDefault ();
  	var src = document.getElementById (ev.dataTransfer.getData ("id"));
  	var srcParent = src.parentNode;
  	var target = ev.currentTarget.firstElementChild;

  	ev.currentTarget.replaceChild (src, target);
  	srcParent.appendChild(target);
	

	
}


function scramble_puzzle(container, ROWS,COLUMNS){

	

	var puzzle_container=container;
	console.log(puzzle_container);
	var image_slices_divs = puzzle_container.getElementsByTagName("div");



	image_slices=[];
	var i;


	for(i=0; i<ROWS+COLUMNS-1; i++){
	//Swap childs between divs
	 swap_elements(image_slices_divs[i])



	}
	//shuffle and re-insert

	// append the container to the body
	document.body.appendChild(puzzle_container);
	
}

function randomInteger(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
  }


function swap_elements(obj1, obj2) {
    obj2.nextSibling === obj1
    ? obj1.parentNode.insertBefore(obj2, obj1.nextSibling)
    : obj1.parentNode.insertBefore(obj2, obj1); 
}

function shuffle(array) {
var currentIndex = array.length, temporaryValue, randomIndex;

// While there remain elements to shuffle...
while (0 !== currentIndex) {

	// Pick a remaining element...
	randomIndex = Math.floor(Math.random() * currentIndex);
	currentIndex -= 1;

	// And swap it with the current element.
	temporaryValue = array[currentIndex];
	array[currentIndex] = array[randomIndex];
	array[randomIndex] = temporaryValue;
}

return array;
}