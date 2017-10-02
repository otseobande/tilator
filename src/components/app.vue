<template>
	<div class="main-wrapper" >
		<div class="control-panel card-2" >
			<div style="display: block; float: right;">
				<div class="zoom-panel">
					<img v-tooltip.bottom="'Zoom In'" class="zoom" src="img/zoom-in.png" width="30" @click="zoomIn">
					<img v-tooltip.bottom="'Zoom Out'" class="zoom" src="img/zoom-out.png" width="30" @click="zoomOut">

					({{wrapperWidth}})
				</div>
				<div class="download-wrapper" @mouseover="updateDataUrl">
					<div class="">
							
						<a class="download" download="Tile">
							<img v-tooltip.bottom="'Download as PNG'" class="download-img" src="img/download.png" width="30">
						</a>
					
						<img v-tooltip.bottom="'Download as PDF'" class="pdf-image" src="img/pdf.png" width="30" @click="saveAsPdf">
					</div>
				</div>
				
			</div>
			<div>Tile Generator</div>
			
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
			
			<div class="image-settings">
				<div style="display: inline">
					<label for="upload-background" class="fileContainer card-1">Change Background
						<input type="file" @change="changeBackgroundImage" class="upload-background" name="upload-background" id="upload-background">
					</label>
					
				</div>
				<div style="display: inline">
					<label for="attach-image" class="fileContainer card-1">Attach image/logo
						<input type="file" mame="attach-image" class="attach-image" @change="attachImage">
					</label>
					<div v-if="imageAdded" style="display: inline">
						<img class="remove-img-btn" v-tooltip.top="'Remove last image'" src="img/close.png" height="20" width="20" @click="removeImage">
					</div>
				</div>
			</div>
			<div v-for="(iText,index) of textBoxes">
				<div class="row">
					<div class="col-sm-9">
						<input type="text" class="form-control" v-model="iText.text" @keyup="reRender">
					</div>
					<div class="col-sm-1">
						<img class="edit-img"  v-tooltip.top="'Edit line styling'" src="img/brush.png" height="30" width="30" @click="toggleEditBox(index)">
					</div>
					<div class="col-sm-1">
						<img class="close-btn" v-tooltip.top="'Remove Line'" src="img/close.png" height="30" width="30" @click="removeItext(index)">
					</div>
				</div>
				<div v-if="editBoxSelected == index" class="text-edit card-1">
					<div class="row">
						<div class="col-sm-6">Font Size:</div>
						<div class="col-sm-6">
							<input type="number" name="font-size" v-model="fontSize" class="form-control" @change="changeFontSize(index)">
						</div>
					</div>

					<div class="row">
						<div class="col-sm-4">Font Type:</div>
						<div class="col-sm-8">
							<select v-model="fontFamily" class="form-control" @change="changeFontFamily(index)">
								<option value="Georgia">Georgia</option>
								<option value="Palatino Linotype">Palatino Linotype</option>
								<option value="Book Antiqua">Book Antiqua</option>
								<option value="Times New Roman">Times New Roman</option>
								<option value="Arial">Arial</option>
								<option value="Helvetica">Helvetica</option>
								<option value="Arial Black">Arial Black</option>
								<option value="Impact">Impact</option>
								<option value="Lucida Sans Unicode">Lucida Sans Unicode</option>
								<option value="Tahoma">Tahoma</option>
								<option value="Verdana">Verdana</option>
								<option value="Courier New">Courier New</option>
								<option value="Lucida Console">Lucida Console</option>
							</select>
						</div>
					</div>
					<div>
						<label>Background Color: </label>
						<input type="color" v-model="backgroundColor" @change="changeBackgroundColor(index)">
					</div>
					<div>
						<label>Font Color:</label>
						<input type="color" v-model="fillColor" @change="changeFillColor(index)">
					</div>
				</div>
			</div>
			<button @click="addTextBox" class="btn card-1">+ Add Text Line</button>
			
			<div class="general-settings card-2">
				<div class="form-group row">
				  <label for="" class="col-6 col-form-label">Text Alignment: </label>
				  <div class="col-6">
				   		<select class="form-control" v-model="textAlignment" @change="changeAlignment"> 
				   			<option value="Left">Left</option>
				   			<option value="Center">Center</option>
				   			<option value="Right">Right</option>
				   		</select>
				  </div>
				</div>
				<div class="form-group row">
				  <label for="" class="col-6 col-form-label">Text Position: </label>
				  <div class="col-6">
				   		<select class="form-control" v-model="textArrangement" @change="changeArrangement"> 
				   			<option value="0">0</option>s
				   			<option value="1">1</option>
				   			<option value="2">2</option>
				   			<option value="3">3</option>
				   			<option value="4">4</option>
				   			<option value="5">5</option>
				   		</select>
				  </div>
				</div>
				<div class="form-group row">
				  <label for="" class="col-6 col-form-label">Font Size: </label>
				  <div class="col-6">
				   		<input type="number" v-model="general.fontSize" class="form-control" @change="changeAllTextFontSize">
				  </div>
				</div>
				<div class="form-group row">
				  <label for="" class="col-6 col-form-label">Text background Color: </label>
				  <div class="col-6">
				   		<input type="color" v-model="general.backgroundColor" class="" @change="changeAllTextBackgroundColor">
				  </div>
				</div>
				<div class="form-group row">
				  <label for="" class="col-6 col-form-label">Font Color: </label>
				  <div class="col-6">
				   		<input type="color" v-model="general.fillColor" class="" name="" @change="
				   		changeAllTextFontColor">
				  </div>
				</div>
			</div>
		</div>
		<div class="work-area">
			<div class="tip">
				<p>
					<strong>TIP: </strong>You can click and drag text lines and images to reposition them.<br>
					You can also select multiple items by clicking and dragging over them
				</p>
			</div>
			<div class="img-canvas-wrapper card-1">
				<canvas id="img-canvas"></canvas>
			</div>
		</div>
	</div>
</template>

<script>
	import {fabric} from 'fabric';
	import jsPDF from 'jspdf';
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
				general:{
					fontSize: 60,
					fontFamily: "Times New Roman",
					fillColor: "#f30707",
					backgroundColor: "#ead50e",
				},
				textBoxes : [],
				images: [],
				editBoxSelected : null,
				template: 1,
				line1: "line 1 text",
				zoom: 60,
				fontSize: 60,
				backgroundColor: "#ead50e",
				fillColor: "#f30707",
				fontFamily: "Times New Roman",
				top: 20,
				left: 200,
				textBoxSelected : true,
				textBoxText:'adsg',
				textAlignment: 'Center',
				textArrangement: '1',

			}
		},

		methods:{
			changeAllTextBackgroundColor(){
				for (let i of this.textBoxes){
					i.set("backgroundColor", this.general.backgroundColor);
				}
				this.backgroundColor = this.general.backgroundColor;
				this.reRender();
			},
			changeAllTextFontColor(){
				for(let i of this.textBoxes){
					i.set("fill", this.general.fillColor);
				}
				this.fillColor = this.general.fillColor;
				this.reRender();
			},
			changeAllTextFontSize(){
				for(let i of this.textBoxes){
					i.set("fontSize", this.general.fontSize);
				}
				this.fontSize = this.general.fontSize;
				this.reRender();
			},
			removeImage(){
				let lastImage = this.images[this.images.length - 1];
				this.removeElementFromArray(this.images, lastImage);
				this.removeObject(lastImage);
			},
			changeAlignment(){
				switch(this.textAlignment){
					case "Left":
						this.left = 1
						for(let i of this.textBoxes){
							i.left = this.left;
						}
						break;

					case "Right":
						for(let i of this.textBoxes){
							this.left = this.canvas.width - i.width
							i.left = this.left;
						}
						break;

					case "Center":
						for(let i of this.textBoxes){
							this.left = (this.canvas.width - i.width) / 2;
							i.left = this.left;
						}
						break;
				}
				this.reRender();
			},
			changeArrangement(){
				let totalHeight = 0;
				switch(this.textArrangement){
					case "1":
						for (let i = 0; i < this.textBoxes.length; i++){
							totalHeight += this.textBoxes[i].height;
							i.top = (this.textBoxes[i].height * i) + 60;

						}
						break;
					case "2":
						for(let i of this.textBoxes){
							i.top += 80;
						}
						break;
				}
				this.reRender();
			},
			toggleEditBox(index){
				this.editBoxSelected = this.editBoxSelected == index ? null : index;
			},
			reRender(){
				canvasFabric.renderAll();
			},
			removeObject(obj){
				canvasFabric.remove(obj);
				this.reRender();
			},
			removeItext(i){
				let iTextObj = this.textBoxes[i]
				this.adjustTextBoxes(i);
				this.removeObject(iTextObj);
				this.textBoxes = this.removeElementFromArray(this.textBoxes,iTextObj);
				
			},
			adjustTextBoxes(index){
				for(let i = index; i < this.textBoxes.length; i++){
					let textBox = this.textBoxes[i];
					textBox.top = textBox.top - this.general.fontSize;
					console.log(textBox.top);
				}
				this.reRender();
			},
			removeElementFromArray(array, element) {
			    return array.filter(e => e !== element);
			},
			changeFontWeight(index){

			},
			changeBackgroundColor(index){
				let activeObject = this.textBoxes[index];
				
				if(activeObject){
					activeObject.set("backgroundColor",this.backgroundColor)
				}
				canvasFabric.renderAll();
			},
			changeFontFamily(index){
				let activeObject = this.textBoxes[index];
				
				if(activeObject){
					activeObject.set("fontFamily",this.fontFamily)
				}
				canvasFabric.renderAll();
			},
			changeFontSize(index){
				let activeObject = this.textBoxes[index];
				if(activeObject){
					activeObject.set("fontSize",this.fontSize);
				}
				canvasFabric.renderAll();
			},
			changeFillColor(index){
				let activeObject = this.textBoxes[index];
				if(activeObject){
					activeObject.set("fill",this.fillColor);
				}
				canvasFabric.renderAll();
			},
			editText(){
				let activeObject = canvasFabric.getActiveObject();
				if(activeObject){
					//activeObject.set("Text",this.textBoxText);
					activeObject.text = "Otse Obande";
					canvasFabric.renderAll();
				}
				
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
				if (this.textBoxes.length >= 1){
					let lastTextBox = this.textBoxes[this.textBoxes.length - 1];
					this.top = lastTextBox.top + this.general.fontSize;
				}
				let textBox = new fabric.IText("ADSGS FASDFSDA",{
					top: this.top,
					left: this.left,
				});
				
				textBox.set("fontWeight", "Bold");
				textBox.set("fontSize",this.fontSize);
				textBox.set("backgroundColor",this.backgroundColor);
				textBox.set("fill",this.fillColor);
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
				let self = this;
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
			            self.images.push(image);
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
				imgObj.src = "img/black-background.jpg";
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
			},
			saveAsPdf(){
				let imgData = document.querySelector(".download").href;
				let doc = new jsPDF();
				doc.addImage(imgData,'PNG',0,0);
				doc.save("tile.pdf");
			}
		},

		computed:{
			wrapperWidth(){
				return this.wrapper.width + "%";
			},
			wrapperHeight(){
				return this.wrapper.height + "%";
			},
			imageAdded(){
				return this.images.length >= 1;
			}
			
		},
		mounted(){
			window.canvasFabric = new fabric.Canvas('img-canvas');
			this.setDefaultBackground();
			for (let i = 0; i<=4; i++){
				this.addTextBox();
			}

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