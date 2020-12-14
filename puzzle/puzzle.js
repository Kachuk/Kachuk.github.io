document.addEventListener("DOMContentLoaded",function(){


    var image_upload=document.getElementById("image_upload");

    image_upload.addEventListener("change", function(e){
        var reader= new FileReader();
        reader.onload = function(event){
            var img= new Image();
       
            img.onload=function(){
                
				var slices=slice_img(img,options.ROWS,options.COLUMNS);
				console.log(slices);
                load_puzzle_images(slices,options.ROWS,options.COLUMNS);
                //document.getElementById("image_div").appendChild(img);
            }
            img.src= event.target.result;
           
        }
        reader.readAsDataURL(e.target.files[0]);
    
    
    });
    
    var options= {
        load_image: function(){
		
            image_upload.click();
        },
        start_puzzle: function(){
			scramble_puzzle(4,4);

		//change color of timer
		document.getElementById("timer_div").classList.remove("alert-warning");
		document.getElementById("timer_div").classList.add("alert-danger");
				
		timer_seconds = document.getElementById("timer_seconds");
		timer_ms = document.getElementById("timer_ms");

		var ms=0;

		var timer= setInterval(function(){

			timer_ms.innerHTML= ms%100;
			timer_seconds.innerHTML = parseInt( ms/100, 10);
			ms++;
		}, 10);
	
		//add puzzle checks on the puzzle slices
		document.getElementById("puzzle_container").addEventListener("dragend", function(){
			check_puzzle(timer);
		});
	   
		},
		ROWS:4,
		COLUMNS:4,
		
	}
	

    
	var gui = new dat.GUI({ autoPlace: false });
	gui.domElement.id = 'gui';
	gui.add(options, "ROWS", 4,16, 1);
	gui.add(options, "COLUMNS", 4,16, 1);
    gui.add(options, 'load_image').name('Load image');
	gui.add(options, 'start_puzzle').name("Start Puzzle");
	
	document.getElementById("gui_container").append(gui.domElement);



	
    
    




});


//slices a image and returns a list with the dirs of the sections sliced
function slice_img(img,ROWS,COLUMNS){
    var image_slices= [];

	
    canvas= document.createElement("canvas");
    canvas.width=(img.width)/COLUMNS;
    canvas.height=(img.height)/ROWS;

    WIDTH=canvas.width;
    HEIGHT=canvas.height;


    ctx = canvas.getContext('2d');

    ctx.drawImage(img,-WIDTH*3,-HEIGHT*3);

    
    for (let j = 0; j < ROWS; j++) {
        
        for (let i = 0; i < COLUMNS; i++) {
             
            ctx.drawImage(img,-WIDTH*i,-HEIGHT*j);
            // image_slices[x][0] contains row index, image_slices[x][1] containx column index, imgs_path[x][2] contains URL
            
            image_slices.push([j,i,canvas.toDataURL()]);
            
        }
    
        
    }
   
   
    return  image_slices;
};




var HEIGHT = 400;
var WIDTH = 400;




function load_puzzle_images(imgs_path, ROWS, COLUMNS, HEIGHT, WIDTH) {
	console.log(imgs_path);
	//remove the last puzzle if it exist
	try {
		document.getElementById("puzzle_container").remove();
		
	}catch{

	}
	var HEIGHT = 400;
	var WIDTH = 400;
	var puzzle_container=document.createElement("div");
	puzzle_container.id="puzzle_container";
	var puzzle_container_css=`

		
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

		//we need to have a way to check if the puzzle is completed, so we give put the grid-are of the container in the image slice
		//and we check if the container and the image correspond to each other
		img_slice.id=imgs_path[x][2];
		img_slice.name= b64EncodeUnicode(img_slice_container.style.cssText);

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
	
	console.log(puzzle_container);
	document.getElementById("puzzle_column").appendChild(puzzle_container);



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


function scramble_puzzle(ROWS,COLUMNS){

	

	var puzzle_container=document.getElementById("puzzle_container");
    var image_slices= puzzle_container.getElementsByTagName("div");
    
 

	image_grid_indexes=[]


	for(var j=1; j<=ROWS; j++){

		for (var i = 1; i <=COLUMNS; i++) {

			image_grid_indexes.push(`${j}/${i}`);					
			
		
		
		}
	}

    shuffled_slices= shuffle_array(image_grid_indexes);


	for (i=0;i< image_slices.length;i++){
		image_slices[i].style = `grid-area:  ${shuffled_slices[i]}`;
						
	}
}




function check_puzzle(timer){

	var puzzle_container=document.getElementById("puzzle_container");
	var image_slices_divs= puzzle_container.getElementsByTagName("div");

	completed= true;

	for (let i = 0; i < image_slices_divs.length; i++) {
		//check if the slice correspond to the div
		container = image_slices_divs[i];
		slice = container.firstChild;
		
		if (container.style.cssText !== b64DecodeUnicode(slice.name)){
			completed= false;
		}

		
	}
	
	//stop the timer if the puzzle is completed
	if(completed){
		clearInterval(timer);
		document.getElementById("timer_div").className="col-md-12 alert alert-success"
	}
	console.log(completed);



}




function puzzle_timer(){
	timer_seconds = document.getElementById("timer_seconds");
	timer_ms = document.getElementById("timer_ms");

	var ms=0;

	var timer= window.setInterval(function(){s

		timer_ms.innerHTML= ms%10;
		timer_seconds = parseInt( ms/10, 10);
	}, 100

	);

}





function randomInteger(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
  }


function swap_elements(obj1, obj2) {
    obj2.nextSibling === obj1
    ? obj1.parentNode.insertBefore(obj2, obj1.nextSibling)
    : obj1.parentNode.insertBefore(obj2, obj1); 
}

function shuffle_array(array) {
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





function b64EncodeUnicode(str) {
    // first we use encodeURIComponent to get percent-encoded UTF-8,
    // then we convert the percent encodings into raw bytes which
    // can be fed into btoa.
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
    }));
}


function b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}


