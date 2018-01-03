<template>
	<div class="main-wrapper" >
		<div class="control-panel card-2" >
			<button @click="download" class="">Download <i class="fas fa-download"></i></button>
			<div style="display: block; float: right;">
				
				<div class="zoom-panel">
					<!-- <img v-tooltip.bottom="'Zoom In'" class="zoom" src="img/zoom-in.png" width="30" @click="zoomIn">
					<img v-tooltip.bottom="'Zoom Out'" class="zoom" src="img/zoom-out.png" width="30" @click="zoomOut"> -->
					<div class="btn-group">
						<button v-tooltip.bottom="'Zoom In'" class="zoom" @click="zoomIn"><i class="fas fa-search-plus"></i></button>
						<button v-tooltip.bottom="'Zoom Out'" class="zoom" @click="zoomOut"><i class="fas fa-search-minus"></i></button>
					</div>
					({{zoomRatio}}%)
				</div>
				
			</div>
			<br>
			<!-- <div>Tile Generator</div> -->
			
			<label for="template">Dimension:</label>
			<select name="template" v-model="template" class="styled-select slate" @change="resizeTemplate" style="margin: 0px;">
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
			
			
			<input type="file" @change="changeBackgroundImage"class="upload-background" name="upload-background" id="upload-background">
			<button @click="uploadBackgroundImage" class="margined-btn">Change Background <i class="fas fa-image"></i></button>

			<div class="textbox-group">
				<div v-for="(iText,index) of textBoxes">
					<div class="row">
						<div class="text-control-wrapper">
							<input type="text" class="textbox" v-model="iText.text" @keyup="reRender">
							<div class="text-edit-controls btn-group">
								<button v-tooltip.top="'Edit line styling'" class="text-control-btn" @click="toggleEditBox(index)"><i class="fas fa-edit"></i></button>
								<button v-tooltip.top="'Remove Line'" class="text-control-btn delete-btn" @click="removeItext(index)"><i class="fas fa-trash-alt"></i></button>
							</div>
						</div>
						<!-- <div class="col-sm-1">
							<img class="edit-img"  v-tooltip.top="'Edit line styling'" src="img/brush.png" height="30" width="30" @click="toggleEditBox(index)">
						</div>
						<div class="col-sm-1">
							<img class="close-btn" v-tooltip.top="'Remove Line'" src="img/close.png" height="30" width="30" @click="removeItext(index)">
						</div> -->
					</div>
					<div v-if="editBoxSelected == index" class="text-edit card-1">
						<div class="row">
							<div class="col-sm-5">Font Size:</div>
							<div class="col-sm-7">
								<input type="number" name="font-size" v-model="fontSize" class="" @change="changeFontSize(index)">
							</div>
						</div>

						<div class="row">
							<div class="col-sm-5">Font Type:</div>
							<div class="col-sm-7">
								<select v-model="fontFamily" class="" @change="changeFontFamily(index)">
									<option v-for="font in fonts" :value="font">{{font}}</option>
									<option v-if="customFonts.length >= 1" disabled>Custom Fonts:</option>
									<option v-for="font in customFonts" :value="font.name">{{font.name}}</option>
								</select>
							</div>
						</div>
						<div class="row">
							<div class="col-sm-5">Background Color: </div>
							<div class="col-sm-7">
								<select v-model="backgroundColor" @change="changeBackgroundColor(index)">
						   			<option value="#00ffff">Cyan (100C)</option>
						   			<option value="#ff00ff">Magenta (100M)</option>
						   			<option value="#ffff00">Yellow (100Y)</option>
						   		</select>
						   	</div>
						</div>
						<div class="row">
							<div class="col-sm-5">Font Color:</div>
							<div class="col-sm-7">
								<input type="color" v-model="fillColor" @change="changeFillColor(index)">
							</div>
						</div>
					</div>
				</div>
			</div>
			<button @click="addTextBox" class="margined-btn">Add text line <i class="fas fa-plus"></i></button>
			
			<input type="file" class="attach-image" @change="attachImage">
			<button @click="uploadImage" class="margined-btn">Attach image <i class="fas fa-image"></i></button>

			<div v-if="imageAdded" style="display: inline">
				<img class="remove-img-btn" v-tooltip.top="'Remove last image'" src="img/close.png" height="20" width="20" @click="removeImage">
			</div>
		
			
			<div class="general-settings card-2">
				<center><h5>General settings</h5></center>
				<div class="row">
				  <div class="col-6">Text Alignment: </div>
				  <div class="col-6">
				   		<select class="" v-model="textAlignment" @change="changeAlignment"> 
				   			<option value="Left">Left</option>
				   			<option value="Center">Center</option>
				   			<option value="Right">Right</option>
				   		</select>
				  </div>
				</div>
				<div class="row">
				  <div class="col-6">Text Position: </div>
				  <div class="col-6">
				   		<select class="" v-model="textArrangement" @change="changeArrangement"> 
				   			<option value="0">0</option>s
				   			<option value="1">1</option>
				   			<option value="2">2</option>
				   			<option value="3">3</option>
				   			<!-- <option value="4">4</option>
				   			<option value="5">5</option> -->
				   		</select>
				  </div>
				</div>
				<div class="row">
				  <div class="col-6">Font Family</div>
				  <div class="col-6">
				   		<select v-model="general.fontFamily" class="" @change="changeAllFontFamily">
							<option v-for="font in fonts" :value="font">{{font}}</option>
							<option v-if="customFonts.length >= 1" disabled>Custom Fonts:</option>
							<option v-for="font in customFonts" :value="font.name">{{font.name}}</option>
						</select>
				  </div>
				</div>
				<div class="form-group row">
				  <label for="" class="col-6">Upload custom font: </label>
				  <div class="col-6">
				   		<button class="" @click.prevent="openUploadFontModal">Upload Font <i class="fas fa-upload"></i></button>
				  </div>
				</div>
				<div class="row">
				  <div class="col-6">Font Size: </div>
				  <div class="col-6">
				   		<input type="number" v-model="general.fontSize" class="" @change="changeAllTextFontSize">
				  </div>
				</div>
				<div class="row">
				  <div class="col-6">Background Color: </div>
				  <div class="col-6">
				   		<!-- <input type="color" v-model="general.backgroundColor" class="" @change="changeAllTextBackgroundColor"> -->
				   		<select v-model="general.backgroundColor" @change="changeAllTextBackgroundColor">
				   			<option value="#00ffff">Cyan (100C)</option>
				   			<option value="#ff00ff">Magenta (100M)</option>
				   			<option value="#ffff00">Yellow (100Y)</option>
				   		</select>
				  </div>
				</div>
				<div class="row">
				  <div class="col-6">Font Color: </div>
				  <div class="col-6">
				   		<input type="color" v-model="general.fillColor" class="" name="" @change="
				   		changeAllTextFontColor">
				  </div>
				</div>
			</div>
		</div>
		<div class="work-area">
			<div class="img-canvas-wrapper card-1">
				<canvas id="img-canvas"></canvas>
			</div>
		</div>
		<sweet-modal ref="uploadFontModal">
			<h3>Upload font file: </h3>
			<input class="form-control" type="file" id="fontFile">
			<div v-if="fontUpload.status == 'success'">
				<p style="color: green">{{fontUpload.message}}!</p>
				<p>You can now select this font under the fontfamily dropdown.</p>
			</div>
			<p v-if="fontUpload.status == 'error'" style="color: red">{{fontUpload.message}}!</p>
			

			<button @click="uploadCustomFont">Upload <i class="fas fa-upload"></i></button>
		</sweet-modal>
		<sweet-modal ref="download">
			<div class="row">
				<div class="col-sm-6">
					<a class="download-as-png" download="tile">
						<i class="fas fa-file-image" style="font-size: 50px;"></i><br>
						Download as PNG
					</a>
				</div>
				<div class="col-sm-6">
					<a href="#" @click.prevent="saveAsPdf">
						<i class="fas fa-file-pdf" style="font-size: 50px;"></i><br>
						Download as pdf
					</a>
				</div>
			</div>
		</sweet-modal>
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
					width: 480,
					height: 480,
				},
				general:{
					fontSize: 44,
					fontFamily: "Times New Roman",
					fillColor: "#f30707",
					backgroundColor: "#ffff00",
				},
				fonts: ["Georgia","Palatino Linotype","Book Antiqua","Times New Roman","Arial","Helvetica","Arial Black","Impact","Lucida Sans Unicode","Tahoma","Verdana","Courier New","Lucida Console"],
				customFonts : [],
				textBoxes : [],
				images: [],
				editBoxSelected : null,
				template: 1,
				line1: "line 1 text",
				zoom: 60,
				fontSize: 44,
				backgroundColor: "#ffff00",
				fillColor: "#f30707",
				fontFamily: "Times New Roman",
				top: 20,
				left: 200,
				textBoxSelected : true,
				textBoxText:'adsg',
				textAlignment: 'Center',
				textArrangement: '1',
				fontUpload:{
					status: '',
					message: '',
				}

			}
		},

		methods:{
			download(){
				this.updateDataUrl();
				this.$refs.download.open();
			},
			updateFonts(){
				let self = this;
				axios.get('listuploadedfonts.php').then((res)=>{
					let data = res.data;
					for(let font of data){
						let fontDetails = font.match(/(.+?)(\.[^.]*$|$)/);
						self.customFonts.push({
							fileName : fontDetails[0],
							name : fontDetails[1],
							extension : fontDetails[2],
						})
					}

					let fontStyle = document.createElement('style');
					let fontStyleText = '';
					
					for(let font of self.customFonts){
						
						fontStyleText += `
							@font-face{
								font-family: ${font.name};
								src: url('${location.href + 'fonts/' + font.fileName}'); 
							}
						`;
						
					}
					
					fontStyle.innerHTML = fontStyleText;
					document.head.appendChild(fontStyle);

					for(let font of this.customFonts){
						let fontObserver = new FontFaceObserver(font.name);
						fontObserver.load()
									.then((val) => {
										console.log(`${font.name} loaded successfully`)
									})
									.catch((err) => {console.log('error loading font')})
					}
				}).catch((err)=>{
					console.log(err);
					console.log(err.response.data);
				});
			},
			openUploadFontModal(){
				this.$refs.uploadFontModal.open();
			},
			closeUploadFontModal(){
				this.$refs.uploadFontModal.close();
			},
			uploadCustomFont(){
				let self = this;
				let formData = new FormData();
				let fontFile = document.querySelector('#fontFile');
				formData.append("fontFile", fontFile.files[0]);
				axios.post('uploadfont.php', formData,{
				    headers: {
				      'Content-Type': 'multipart/form-data'
				    }
				}).then((res)=>{
					console.log(res.data)
					if(res.data.status == 'success'){
						self.updateFonts();
					}
					self.fontUpload = res.data;
				}).catch((err)=>{
					console.log(err);
					console.log('error uploading font');
				});
			},
			changeAllTextBackgroundColor(){
				for (let i of this.textBoxes){
					i.set("backgroundColor", this.general.backgroundColor);
				}
				this.backgroundColor = this.general.backgroundColor;
				this.reRender();
			},
			changeAllFontFamily(){
				for (let i of this.textBoxes){
					i.set("fontFamily",this.general.fontFamily)
				}
				this.fontFamily = this.general.fontFamily;
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
				this.changeArrangement();
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
							this.left = this.canvas.width - (i.width + i.padding);
							i.left = this.left;
						}
						break;

					case "Center":
						for(let i of this.textBoxes){
							this.left = (this.canvas.width - (i.width + i.padding)) / 2;
							i.left = this.left;
						}
						break;
				}
				this.reRender();
			},
			changeArrangement(){
				let height = this.canvas.height;

				switch(this.textArrangement){
					case "1":
						this.arrangeText(0);
						break;
					case "2":
						this.arrangeText(height * 0.2);
						break;
					case "3":
						this.arrangeText(height * 0.6);
						break;
				}
				this.reRender();
			},
			arrangeText(top){
				let prevTextLine = this.textBoxes[0];
				for (let obj of this.textBoxes){
					if(obj == prevTextLine){
						obj.top = top;
					}
					obj.top = prevTextLine.height + prevTextLine.padding + prevTextLine.top;
					prevTextLine = obj;
				}
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
				if(confirm('Are you sure you want to remove line?')){
					let iTextObj = this.textBoxes[i]
					this.adjustTextBoxes(i);
					this.removeObject(iTextObj);
					this.textBoxes = this.removeElementFromArray(this.textBoxes,iTextObj);
				}	
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
				let self = this;
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
				this.changeArrangement();
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
				this.wrapper.width += this.wrapper.width * 0.1;
				this.wrapper.height += this.wrapper.height * 0.1;
				this.adjustWrapper();
			},
			zoomOut(){
				const wrapper = document.querySelector(".img-canvas-wrapper");
				if(this.wrapper.width > 10){
					this.wrapper.width -= this.wrapper.width * 0.1;
					this.wrapper.height -= this.wrapper.height * 0.1;
					this.adjustWrapper();
				}
				
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
					
						break;
					case "2":
						this.canvas.width = 828;
						this.canvas.height = 315;
						
						break;
					case "3":
						this.canvas.width = 1920;
						this.canvas.height = 1080;
						
						break;
					case "4":
						this.canvas.width = 504;
						this.canvas.height = 1228;
					
						break;
					case "5":
						this.canvas.width = 1200;
						this.canvas.height = 628;
						
						break;
					case "6":
						this.canvas.width = 1080;
						this.canvas.height = 1080;
						
						break;
				}
				if(this.canvas.width > 1000 || this.canvas.height > 1000){
					this.wrapper.width = this.canvas.width * 0.4;
					this.wrapper.height = this.canvas.height * 0.4;
				}else{
					this.wrapper.width = this.canvas.width * 0.6;
					this.wrapper.height = this.canvas.height * 0.6;
				}
				
				this.changeAlignment();
				this.adjustWrapper(); 
				
				this.setDefaultBackground();
				canvasFabric.setWidth(this.canvas.width);
				canvasFabric.setHeight(this.canvas.height);
				
				canvasFabric.renderAll();
			},
			updateDataUrl(){
				const url = canvasFabric.toDataURL();
				document.querySelector(".download-as-png").href = url;			
			},
			addTextBox(){
				if (this.textBoxes.length >= 1){
					let lastTextBox = this.textBoxes[this.textBoxes.length - 1];
					this.top = lastTextBox.top + lastTextBox.padding +  this.general.fontSize;
				}
				let textBox = new fabric.Text("ADSGS FASDFSDA",{
					top: this.top,
					left: this.left,
				});
				
				textBox.set("padding", 20);
				textBox.set("fontWeight", "Bold");
				textBox.set("fontSize",this.fontSize);
				textBox.set("backgroundColor",this.backgroundColor);
				textBox.set("fill",this.fillColor);
				canvasFabric.add(textBox);
				this.textBoxes.push(textBox);
			}, 
			uploadBackgroundImage(){
				let backgroundInput = document.querySelector('.upload-background');
				backgroundInput.click();
			},
			changeBackgroundImage(e){

				let reader = new FileReader();
				let self = this;
				reader.onload = function(event){
					let imgObj = new Image();
					imgObj.src = event.target.result;
			        imgObj.onload = function () {
			            var image = new fabric.Image(imgObj);
			             var canvas = document.createElement('canvas');
				        canvas.width = self.canvas.width; 
				        canvas.height = self.canvas.height;

		        		canvas.getContext('2d').drawImage(imgObj, 0, 0);

		        		let url = canvas.toDataURL();
			            canvasFabric.setBackgroundImage(url,canvasFabric.renderAll.bind(canvasFabric),{
								// width: canvasFabric.width,
								// height: canvasFabric.height,
								originX: 'left',
				 				originY: 'top'
						});
						canvasFabric.renderAll();;
			        }
				}	
				reader.readAsDataURL(e.target.files[0]);
			},
			uploadImage(){
				let imageInput = document.querySelector('.attach-image');
				imageInput.click();
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
			
        		canvasFabric.setBackgroundImage("img/blue-background.jpg",canvasFabric.renderAll.bind(canvasFabric),{
						width: canvasFabric.width,
						height: canvasFabric.height,
						originX: 'left',
		 				originY: 'top',
		 				//backgroundImageStretch: true,
					});
        		canvasFabric.renderAll();
	    
			},
			saveAsPdf(){
				let imgData = document.querySelector(".download-as-png").href;
				let doc = new jsPDF();
				doc.addImage(imgData,'PNG',0,0);
				doc.save("tile.pdf");
			},
		},

		computed:{
			wrapperWidth(){
				return this.wrapper.width + "px";
			},
			wrapperHeight(){
				return this.wrapper.height + "px";
			},
			imageAdded(){
				return this.images.length >= 1;
			},
			zoomRatio(){
				let ratio = (this.wrapper.width / this.canvas.width) * 100;

				return ratio.toFixed(1);
			}
			
		},
		mounted(){

			window.canvasFabric = new fabric.StaticCanvas('img-canvas');
			fabric.Text.prototype.set({
			  _getNonTransformedDimensions() { // Object dimensions
			    return new fabric.Point(this.width, this.height).scalarAdd(this.padding);
			  },
			  _calculateCurrentDimensions() { // Controls dimensions
			    return fabric.util.transformPoint(this._getTransformedDimensions(), this.getViewportTransform(), true);
			  }
			});

			this.setDefaultBackground();
			for (let i = 0; i<=4; i++){
				this.addTextBox();
			}
			this.adjustWrapper();
			this.updateFonts();
			
		}
	}
</script>