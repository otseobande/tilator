<template>
	<div class="main-wrapper" >
		<div class="control-panel card-2" >
			<div style="float: right;">
				<div class="zoom-panel">
					<img src="img/zoomin.png" @click="zoomIn">
					<img src="img/zoomout.png" @click="zoomOut">
					({{wrapperWidth}})
				</div>
				<div class="download-wrapper" @mouseover="updateDataUrl">	
					<a class="download" download="Tile">
						<img src="img/download.png">
					</a>
				</div>
			</div>
			<label for="template">Template:</label>
			<select name="template" v-model="template" class="styled-select slate" @change="resizeTemplate">
				<option value="1">Facebook Tile (800px x 800px)</option>
				<option value="2">Facebook Header (828px x 315px)</option>
				<option value="3">Facebook Event (1920px x 1080px)</option>
				<option value="4">Facebook Flip-Up Art (504px x 1228px)</option>
				<option value="5">Twitter Post (1200px x 628px)</option>
				<option value="6">Instagram Post (1080px x 1080px)</option>
				<option value="7">Custom</option>
			</select>
			<div v-if="template == 7">
				<label>Height:</label>
				<input class="form-control" type="number" v-model.number="canvas.height" placeholder="height">
				<label>Width:</label>
				<input class="form-control" type="number" v-model.number="canvas.width" placeholder="width">
			</div>
		
			<button @click="addTextBox" class="btn card-1">Add Text Box</button>
			<div>
				<label for="upload-background">Change Background:</label>
				<input type="file" @change="changeBackgroundImage" class="upload-background" name="upload-background" id="upload-background">
				
			</div>
			<div>
				<label for="attach-image">Attach image/logo:</label>
				<input type="file" mame="attach-image" class="attach-image" @change="attachImage">
			</div>
			<div v-if="textBoxSelected" class="text-edit card-1">
				<div>
					<label for="font-size">Font Size:</label>
					<input type="number" name="font-size" v-model="fontSize" @keyup="changeFontSize">
				</div>
				<!-- <div>
					<label for="Text">Text: </label>
					<input type="text" name="Text" v-model="textBoxText" @keyup="editText">
				</div> -->
				<div>
					<label>Background Color: </label>
					<input type="color" v-model="backgroundColor" @change="changeBackgroundColor">
				</div>
				<div>
					<label>Font Color:</label>
					<input type="color" v-model="fillColor" @change="changeFillColor">
				</div>
			</div>
		</div>
		<div class="work-area">
			<div class="img-canvas-wrapper card-1">
				<canvas id="img-canvas" ></canvas>
			</div>
		</div>
	</div>
</template>

<script>
	import {fabric} from 'fabric';
	export default{
		data(){
			return {
				canvas:{
					height: 800,
					width: 800,
				},
				wrapper:{
					width: 60,
					height: 60,
				},
				textBoxes : [],
				template: 1,
				line1: "line 1 text",
				zoom: 60,
				fontSize: 40,
				backgroundColor: '#ffffff',
				fillColor: '#000000',
				top: 20,
				left: 30,
				textBoxSelected : false,
				textBoxText:'',
			}
		},

		methods:{
			changeBackgroundColor(){
				let activeObject = canvasFabric.getActiveObject();
				
				if(activeObject){
					activeObject.set("backgroundColor",this.backgroundColor)
				}
				canvasFabric.renderAll();
			},
			changeFontSize(){
				let activeObject = canvasFabric.getActiveObject();
				if(activeObject){
					activeObject.set("fontSize",this.fontSize);
				}
				canvasFabric.renderAll();
			},
			changeFillColor(){
				let activeObject = canvasFabric.getActiveObject();
				if(activeObject){
					activeObject.set("fill",this.fillColor);
				}
				canvasFabric.renderAll();
			},
			editText(){
				let activeObject = canvasFabric.getActiveObject();
				if(activeObject){
					activeObject.set("Text",this.textBoxText);
				}
				canvasFabric.renderAll();
			},
			zoomIn(){
				const wrapper = document.querySelector(".img-canvas-wrapper");
				this.wrapper.width += 10;
				this.wrapper.height += 10;
				this.adjustWrapper();
			},
			zoomOut(){
				const wrapper = document.querySelector(".img-canvas-wrapper");
				if(this.wrapper.width > 10){
					this.wrapper.width -= 10;
					this.wrapper.height -= 10;
				}
				this.adjustWrapper();
			},
			adjustWrapper(){
				const wrapper = document.querySelector(".img-canvas-wrapper");
				wrapper.style.width = this.wrapperWidth;
				wrapper.style.height = this.wrapperHeight;
			},
			resizeTemplate(){
				switch(this.template){
					case "1":
						this.canvas.width = 800;
						this.canvas.height = 800;
						this.wrapper.width = 60;
						this.wrapper.height = 60;
						break;
					case "2":
						this.canvas.width = 828;
						this.canvas.height = 315;
						this.wrapper.width = 60;
						this.wrapper.height = 40;
						break;
					case "3":
						this.canvas.width = 1920;
						this.canvas.height = 1080;
						this.wrapper.width = 70;
						this.wrapper.height = 40;
						break;
					case "4":
						this.canvas.width = 504;
						this.canvas.height = 1228;
						this.wrapper.width = 30;
						this.wrapper.height = 60;
						break;
					case "5":
						this.canvas.width = 1200;
						this.canvas.height = 628;
						this.wrapper.width = 65;
						this.wrapper.height = 35
						break;
					case "6":
						this.canvas.width = 1080;
						this.canvas.height = 1080;
						this.wrapper.width = 60;
						this.wrapper.height = 60;
						break;
				}
				
				this.adjustWrapper(); 
				
				this.setDefaultBackground();
				canvasFabric.setWidth(this.canvas.width);
				canvasFabric.setHeight(this.canvas.height);
				
				canvasFabric.renderAll();
			},
			updateDataUrl(){
				const url = canvasFabric.toDataURL();
				document.querySelector(".download").href = url;
			
			},
			addTextBox(){
				let textBox = new fabric.IText("Double click to edit,drag to position",{
					top: this.top,
					left: this.left,
				});
				this.top += 25;
				this.left += 25;
				textBox.set("fontSize",this.fontSize);
				canvasFabric.add(textBox);
				this.textBoxes.push(textBox);
			},
			changeBackgroundImage(e){
				let reader = new FileReader();
				let self = this;
				reader.onload = function(event){
					let imgObj = new Image();
					imgObj.src = event.target.result;
			        imgObj.onload = function () {
			            var image = new fabric.Image(imgObj);
			            canvasFabric.setBackgroundImage(image,canvasFabric.renderAll.bind(canvasFabric),{
								width: canvasFabric.width,
								height: canvasFabric.height,
								originX: 'left',
				 				originY: 'top'
						});
						canvasFabric.renderAll();;
			        }
				}	
				reader.readAsDataURL(e.target.files[0]);
			},
			attachImage(e){
				var reader = new FileReader();
			    reader.onload = function (event) {
			        var imgObj = new Image();
			        imgObj.src = event.target.result;
			        imgObj.onload = function () {
			            // start fabricJS stuff
			            
			            var image = new fabric.Image(imgObj);
			            image.set({
			                left: 250,
			                top: 250,
			                angle: 0,
			                padding: 10,
			                cornersize: 10
			            });
			            //image.scale(getRandomNum(0.1, 0.25)).setCoords();
			            canvasFabric.add(image);
			            
			            // end fabricJS stuff
			        }
			        
			    }
			    reader.readAsDataURL(e.target.files[0]);
			},
			setDefaultBackground(){
				canvasFabric.setWidth(this.canvas.width);
				canvasFabric.setHeight(this.canvas.height);
				let imgObj = new Image();
				imgObj.src = "img/landscape.jpg";
				let self = this;
				imgObj.onload = function () {
					
			        var canvas = document.createElement('canvas');
			        canvas.width = self.canvas.width; 
			        canvas.height = self.canvas.height;

	        		canvas.getContext('2d').drawImage(imgObj, 0, 0);

	        		let url = canvas.toDataURL();
	      
	        		canvasFabric.setBackgroundImage(url,canvasFabric.renderAll.bind(canvasFabric),{
							width: canvasFabric.width,
							height: canvasFabric.height,
							originX: 'left',
			 				originY: 'top'
						});
	        		canvasFabric.renderAll();
	        	}
			}
		},

		computed:{
			wrapperWidth(){
				return this.wrapper.width + "%";
			},
			wrapperHeight(){
				return this.wrapper.height + "%";
			},
			
		},
		mounted(){
			window.canvasFabric = new fabric.Canvas('img-canvas');
			this.setDefaultBackground();
			this.addTextBox();
			this.changeBackgroundColor();
			let self = this;
			canvasFabric.on('object:selected', function(options) {
			  if (options.target) {
			  	self.textBoxSelected = true;
			    console.log('an object was clicked! ', options.target.type);
			  }
			});

		}
	}
</script>