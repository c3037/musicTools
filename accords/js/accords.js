//Created by Dmitry Porozhnyakov(diman9300@mail.ru) - 2013
var accords = (function(){
	var r;
	var a={"A":9, "B":11, "C":0, "D":2, "E":4, "F":5, "G":7,"#":"sign","b":"sign","m":"minor"};
	return{
		accord:"",
		generatedAccord:[],//['A','#','m']
		enteredAccord:[],//['A','#','m']
		generatedNumbers:[],//[0,2,3](12th) //Для сравнения
		generatedFullNumbers:[],//[0,2,3](24th)//Для отображения
		enteredNumbers:[],//[12,2,3](24th)
		mode : "ACCKEY",
		mode2 : "Accords",
		colorSettings:{"0":"white","1":"sharp","2":"bemol"},
		minorMajorSettings:{"0":"minor","1":"major"},
		toneSettings:{"0":"tone","1":"semitone"},
		generatedTAS:0,
		generatedStep:1,
		aXgenerated:0,
		keyboard:[],
		refr:function(){
			accords.refresh_buffers();
			accords.render_keyboard();
			accords.generate_task();
		},
    	init:function(){
    		r = new Raphael("keyboard", 560, 120);
    		this.initKeyboard();
    		this.generate_task();
    		$("#blockAccord").click(function(){
    			accords.refr();
    		});
    		$("#blockTrue").click(function(){accords.refr();});
        	$("#blockFalse").click(function(){accords.refr();});
        	
    		$("#key_change_mode input[type='button']").click(function(){
    			if(accords.mode == "ACCKEY"){
    				accords.mode = "KEYACC";
    			}
    			else{
    				accords.mode = "ACCKEY";
    			}
    			accords.refr();
    		});
    		$("#blockKeys div input[type='button']").click(function(){
    			var value = $(this).val();
    			if(accords.enteredAccord[value] == value){accords.key_off(value);}
				else{accords.key_on(value);}	
    		});
    		
    		
    		//Проверяем Минор - Мажор
    		$("#major").click(function(){
    			if(accords.minorMajorSettings["1"] == "major"){
    				delete accords.minorMajorSettings["1"];
    			}else{
    				accords.minorMajorSettings["1"] = "major";
    			}
    			accords.refr();
    		});
    		$("#minor").click(function(){
    			if(accords.minorMajorSettings["0"] == "minor"){
    				delete accords.minorMajorSettings["0"];
    			}else{
    				accords.minorMajorSettings["0"] = "minor";
    			}
    			accords.refr();
    		});
    		
    		//Проверяем чёрные-белые
    		$("#white").click(function(){
    			if(accords.colorSettings["0"] == "white"){
    				delete accords.colorSettings["0"];
    			}else{
    				accords.colorSettings["0"] = "white";
    			}
    			accords.refr();
    		});
    		$("#sharp").click(function(){
    			if(accords.colorSettings["1"] == "sharp"){
    				delete accords.colorSettings["1"];
    			}else{
    				accords.colorSettings["1"] = "sharp";
    			}
    			accords.refr();
    		});
    		$("#bemol").click(function(){
    			if(accords.colorSettings["2"] == "bemol"){
    				delete accords.colorSettings["2"];
    			}else{
    				accords.colorSettings["2"] = "bemol";
    			}
    			accords.refr();
    		});
    		$("#blacks").click(function(){
    			if(accords.colorSettings["1"] == "sharp" || accords.colorSettings["2"] == "bemol"){
    				delete accords.colorSettings["1"];
    				delete accords.colorSettings["2"];
    			}else{
    				accords.colorSettings["1"] = "sharp";
    				accords.colorSettings["2"] = "bemol";
    			}
    			accords.refr();
    		});

    		$("#key_change_mode input#oneButton").click(function(){
    			if($("#key_change_mode input#oneButton").val() == "Постройте аккорд"){
    				$("#key_change_mode input#oneButton").val("Назовите аккорд");
    				$("#key_change_mode input#twoButton").val("Назовите ноту");
    				$("#semitone").attr('disabled', 'disabled');
    				$("#tone").attr('disabled', 'disabled');
    				if(accords.mode2 != "Accords")$("#key_m input").attr('disabled', 'disabled');
    				else $("#key_m input").removeAttr('disabled');
    				
    				$("#key_color input").removeAttr('disabled');
    			} else {
    				$("#key_change_mode input#oneButton").val("Постройте аккорд");
    				$("#key_change_mode input#twoButton").val("Постройте (полу)тон");
    				$("#semitone").removeAttr('disabled');
    				$("#tone").removeAttr('disabled');
    				$("#key_m input").removeAttr('disabled');
    				if(accords.mode2 != "Accords")$("#key_color input").attr('disabled', 'disabled');
    				else $("#key_color input").removeAttr('disabled');
    			}
    		});
    		$("#accnotes").click(function(){
    			if($("#accnotes").val() == "Аккорды"){
    				$("#accnotes").val("Ноты");
    				accords.mode2 = "Notes";
    				$("#key_change_mode input#oneButton").hide();
    				$("#key_change_mode input#twoButton").show();
    				$("#chbx").hide();
    				$("#chbx2").show();
    				accords.refr();
    				if($("#tone").attr('disabled') != "disabled"){
    					$("#key_color input").attr('disabled', 'disabled');
    				} else {
    					$("#key_m input").attr('disabled', 'disabled');
    				}
    			} else {
    				$("#accnotes").val("Аккорды");
    				accords.mode2 = "Accords";
    				$("#key_change_mode input#twoButton").hide();
    				$("#key_change_mode input#oneButton").show();
    				$("#chbx2").hide();
    				$("#chbx").show();
    				$("#key_color input").removeAttr('disabled');
    				accords.refr();
    				$("#key_m input").removeAttr('disabled');
    			}
    		});
    		$("#key_change_mode input#twoButton").click(function(){
    			if($("#key_change_mode input#twoButton").val() == "Постройте (полу)тон"){
    				$("#key_change_mode input#oneButton").val("Назовите аккорд");
    				$("#key_change_mode input#twoButton").val("Назовите ноту");
    				$("#semitone").attr('disabled', 'disabled');
    				$("#tone").attr('disabled', 'disabled');
    				
    				if(accords.mode2 != "Accords")$("#key_m input").attr('disabled', 'disabled');
    				else $("#key_m input").removeAttr('disabled');
    				
    				$("#key_color input").removeAttr('disabled');
    			} else {
    				$("#key_change_mode input#oneButton").val("Постройте аккорд");
    				$("#key_change_mode input#twoButton").val("Постройте (полу)тон");
    				$("#semitone").removeAttr('disabled');
    				$("#tone").removeAttr('disabled');
    				$("#key_m input").removeAttr('disabled');
    				if(accords.mode2 != "Accords")$("#key_color input").attr('disabled', 'disabled');
    				else $("#key_color input").removeAttr('disabled');
    			}
    		});
    		
    		$("#semitone").click(function(){
    			if(accords.toneSettings["1"] == "semitone"){
    				delete accords.toneSettings["1"];
    			}else{
    				accords.toneSettings["1"] = "semitone";
    			}
    			accords.refr();
    		});
    		$("#tone").click(function(){
    			if(accords.toneSettings["0"] == "tone"){
    				delete accords.toneSettings["0"];
    			}else{
    				accords.toneSettings["0"] = "tone";
    			}
    			accords.refr();
    		});
    	},
    	initKeyboard:function(){
    		var black_keys={"1":'b',"3":"b","6":"b","8":"b","10":"b","13":'b',"15":"b","18":"b","20":"b","22":"b",};
    		r.clear();
			var wk=0;
    		for(var i=0;i<24;i++){
    			if(black_keys[i]=='b'){//black
    				this.keyboard[i]=r.rect(wk*40-15, 0, 30, 70).attr({stroke: "#000", fill:"#000" , "stroke-opacity": 1,"stroke-width": 1, "cursor":"pointer"}).data("color_keys",'#000').data("number",i).click(function(){
    					if(accords.mode == "ACCKEY"){
    						if(accords.enteredNumbers[this.data('number')] == this.data('number')){accords.note_off(this.data('number'));}
        					else{accords.note_on(this.data('number'));}	
    					}
    				});
    			}else{//white
    				this.keyboard[i]=r.rect(wk*40, 0, 40, 120).attr({stroke: "#000", fill:"#fff" , "stroke-opacity": 1,"stroke-width": 1, "cursor":"pointer"}).toBack().data("color_keys",'#fff').data("number",i).click(function(){
    					if(accords.mode == "ACCKEY"){
    						if(accords.enteredNumbers[this.data('number')] == this.data('number')){accords.note_off(this.data('number'));} 
    						else{accords.note_on(this.data('number'));}
    					}
        			});
    				wk++;
    			}
    		}
    	},
    	generate_accord:function(){
    		var note = ["A","B","C","D","E","F","G"];
    		
    		var minor = [];
    		if(this.count_elements_in_array(this.minorMajorSettings) == 1){
    			if(this.minorMajorSettings["0"] == "minor"){
    				minor = ["m"];
    			} else {
    				minor = [""];
    			}
    		} else {
    			minor = ["", "m"];
    		}
    		
    		var accidental = [], x = {"0":"", "1":"#", "2":"b"};
    		if(this.colorSettings["0"] != "white"){
    			delete x["0"];
    		}
    		if(this.colorSettings["1"] != "sharp"){
    			delete x["1"];
    		}
    		if(this.colorSettings["2"] != "bemol"){
    			delete x["2"];
    		}
    		if(this.count_elements_in_array(x) == 0){
    			x = {"0":"", "1":"#", "2":"b"};
    		}
    		for(var i in x){
    			accidental[accidental.length] = x[i];
    			delete x[i];
    		}
    		
    		while(1){
    			one = Math.floor(Math.random() * ((note.length - 1) + 1));
     			two = Math.floor(Math.random() * ((minor.length - 1) + 1));
     			three = Math.floor(Math.random() * ((accidental.length - 1) + 1));
     			
     			if(((note[one] == "B" || note[one] == "E") && accidental[three] == "#") || ((note[one] == "C" || note[one] == "F") && accidental[three] == "b")){
     				continue;
     			} else{
     				var m = note[one]+minor[two]+accidental[three];
     				if(m == this.accord){
     					continue;
     				}else{
     					break;
     				}
     			}
    		}
 			
 			this.generatedAccord[this.generatedAccord.length] = note[one];
 			if(minor[two] != ""){
 				this.generatedAccord[this.generatedAccord.length] = minor[two];
 			}
 			if(accidental[three] != ""){
 				this.generatedAccord[this.generatedAccord.length] = accidental[three];
 			}
 			this.accord = "";
 			for(var i = 0; i < this.generatedAccord.length; i++){
 				this.accord = this.accord+ this.generatedAccord[i];
 			}
    	},
    	generate_TAS:function(){
    		var x = 0, y = 1;
    		if(this.count_elements_in_array(this.toneSettings) == 1){
    			if(this.toneSettings["0"] == "tone"){
    				y = 2;
    				x = Math.floor(Math.random() * 21);
    			} else {
    				x = Math.floor(Math.random() * 22);
    			}
    		} else {   			
    			y = Math.round(Math.random())+1;
    			if(y == 1){
    				x = Math.floor(Math.random() * 22);
    			}
    			else{
    				x = Math.floor(Math.random() * 21);
    			}
    		}
    		this.generatedTAS = x;
    		this.generatedStep = y;
    	},
    	format_accord:function(accord_array){
    		var s="",m="",l="";
    		for(var i in accord_array){
    			switch(a[accord_array[i]]){
    			case 'sign':
    				s = accord_array[i];
    			break;
    			case 'minor':
    				m = accord_array[i];
    			break;
    			default:
    				l=accord_array[i];
    			break;
    			}
    		}
    		return l+m+s;
    	},
    	accord_to_numbers:function(arrayOfAccords){
    		///////////  X = 0-4 7 ||| Xm = 0-3-7  ///////////
    		var s=0,m=0,l=0;
    		for(var i in arrayOfAccords){
    			switch(a[arrayOfAccords[i]]){
    			case 'sign':
    				if(arrayOfAccords[i]=='b')s=-1;else s=1;
    			break;
    			case 'minor':
    				m=-1;
    			break;
    			default:
    				l=a[arrayOfAccords[i]];
    			break;
    			}
    		}
    		return [l+s,l+s+4+m,l+s+7];
    	},
    	compare_accord_name:function(){

    		if(this.generatedAccord.length == this.count_elements_in_array(this.enteredAccord) && this.mode=="KEYACC"){
    			
    			this.generatedNumbers.length = 0;
        		this.generatedNumbers = this.accord_to_numbers(this.generatedAccord);
        		this.generatedFullNumbers.length = 0;
        		this.generatedFullNumbers = this.generatedNumbers;
        		
        		this.enteredNumbers.length = 0;
        		this.enteredNumbers = this.accord_to_numbers(this.enteredAccord);
        		return this.compare_numbers();
    		}else{
    			return 0;// длинна не равна
    		}
    	},
    	compare_numbers:function(){    		
    		if(this.generatedNumbers.length == this.count_elements_in_array(this.enteredNumbers)){
    			var tr=1;
	    		for(var v in this.generatedNumbers){
	    			var s=0;
	    			for(var i in this.enteredNumbers){
	    				if(this.to_12(this.enteredNumbers[i])==this.to_12(this.generatedNumbers[v])) s=1;
	    			}
	    			if(s!=1)tr=0;
	    		}
	    		if(tr==1){
	    			return 1;//всё совпало
	    		}else{
	    			return -1;//не совпало
	    		}
    		}else{
    			return 0;// длинна не равна
    		}
    	},
    	compare_numbers_2:function(){    		
    		if(this.generatedNumbers.length == this.count_elements_in_array(this.enteredNumbers)){
    			var tr=1;
	    		for(var v in this.generatedNumbers){
	    			var s=0;
	    			for(var i in this.enteredNumbers){
	    				if(this.enteredNumbers[i]==this.generatedNumbers[v]) s=1;
	    			}
	    			if(s!=1)tr=0;
	    		}
	    		if(tr==1){
	    			return 1;//всё совпало
	    		}else{
	    			return -1;//не совпало
	    		}
    		}else{
    			return 0;// длинна не равна
    		}
    	},
    	to_12:function(full){
    		if(full>=12){
    			full -= 12;
    		}
    		return full;
    	},
    	refresh_buffers:function(){
    		this.generatedAccord.length = 0;
    		this.generatedNumbers.length = 0;
    		this.generatedFullNumbers.length = 0;
    		this.enteredNumbers.length = 0;
			$("#blockKeys div input").removeClass("selected");
			for(var i in this.enteredAccord){
				delete this.enteredAccord[i];
			}
    	},
    	
    	note_on:function(note){		
    		this.enteredNumbers[note]=note;
    		this.render_keyboard();
    		if(this.mode2 == "Accords"){
    			if(this.mode == "ACCKEY"){
        			this.hide_all_panels();
        			$("#blockAccord").text(this.accord).show();
        		}
        		switch(this.compare_numbers()){
        		case 1://всё совпало
        			this.render_true_value();
        		break;
        		case -1://не совпало
        			this.render_false_value();
            	break;
        		default://длина не равна
            	break;
        		}
    		} else {
    			if(this.mode == "ACCKEY"){
        			this.hide_all_panels();
        			var text = "Постройте полутон";
        			if(this.generatedStep == 2){
        				text  = "Постройте тон";
        			}
        			$("#blockAccord").text(text).show();
        		}
    			switch(this.compare_numbers_2()){
        		case 1://всё совпало
        			this.render_true_value();
        		break;
        		case -1://не совпало
        			this.render_false_value();
            	break;
        		default://длина не равна
            	break;
        		}
    		}
    		
    	},
    	note_off:function(note){
    		delete this.enteredNumbers[note];
    		this.render_keyboard();
    	},
    	key_on:function(value){
    		this.enteredAccord[value] = value;
    		$("#blockKeys div input[value='"+value+"']").addClass("selected");
    		if(this.mode2 == "Accords"){
	    		switch(this.compare_accord_name()){
		    		case 1://всё совпало
		    			this.render_true_value_onkeys();
		    		break;
		    		case -1://не совпало
		    			this.render_false_value_onkeys();
		        	break;
		    		default://длина не равна
		        	break;
	    		}
    		} else {
    			switch(this.compare_accord_name()){
	    		case 1://всё совпало
	    			this.render_true_value_onkeys();
	    		break;
	    		case -1://не совпало
	    			this.render_false_value_onkeys();
	        	break;
	    		default://длина не равна
	        	break;
    		}
    		}
    	},
    	key_off:function(value){
    		delete this.enteredAccord[value];
    		$("#blockKeys div input[value='"+value+"']").removeClass("selected");
    	},
    	//////////////////////////////////////////////////////////////////////////////////////////
    	render_true_value:function(){
    		this.hide_all_panels();
    		this.show_accord_on_keyboard("#0f0");
    		if(this.mode2 == "Accords"){
    			var x  = " ("+this.accord+")";
    		} else{
    			var x = "";
    		}
    		$("#blockTrue").html("").append("Правильно"+x).show();
    	},
    	render_false_value:function(){
    		this.hide_all_panels();
    		this.show_accord_on_keyboard("#f00");
    		if(this.mode2 == "Accords"){
    			var x  = " ("+this.accord+")";
    		} else{
    			var x = "";
    		}
    		$("#blockFalse").html("").append("Неправильно"+x).show();
    	},
    	hide_all_panels:function(){
    		$(".panel").hide();	
    	},
    	render_true_value_onkeys:function(){
    		this.hide_all_panels();
   			var x  = " ("+this.format_accord(this.enteredAccord)+")";
    		$("#blockTrue").html("").append("Правильно"+x).show();
    	},
    	render_false_value_onkeys:function(){
    		this.hide_all_panels();
    		var x  = " ("+this.format_accord(this.generatedAccord)+")";
    		$("#blockFalse").html("").append("Неправильно"+x).show();
    	},
    	///////////////////////////////////////////////////////////////////////////
    	generate_task:function(){
    		this.hide_all_panels();
    		if(this.mode2 == "Accords"){
    			this.generate_accord();
        		this.generatedNumbers.length = 0;
        		this.generatedNumbers = this.accord_to_numbers(this.generatedAccord);
        		this.generatedFullNumbers.length = 0;
        		this.generatedFullNumbers = this.generatedNumbers;
        		if(this.mode == "ACCKEY"){
        			$("#blockAccord").text(this.accord).show();
        		}
        		else{
        			this.show_accord_on_keyboard("#0ff");
        			$("#blockKeys").show();
        		}
    		}
    		else {
    			this.generate_TAS();
    			if(this.mode == "ACCKEY"){
        			var text  = "Постройте полутон";
        			if(this.generatedStep == 2){
        				text  = "Постройте тон";
        			}
        			$("#blockAccord").text(text).show();
        			this.enteredNumbers.length = 0;
        			this.enteredNumbers[this.generatedTAS]=this.generatedTAS;
        			this.generatedNumbers[this.generatedNumbers.length]=this.generatedTAS;
        			this.generatedNumbers[this.generatedNumbers.length]=this.generatedTAS+this.generatedStep;
            		this.render_keyboard();
        		}
        		else{
        			var a = [];
        			var white = [0,2,4,5,7,9,11,12,14,16,17,19,21,23];
        			var black = [1,3,6,8,10,13,15,18,20,21];
        			if(this.colorSettings["0"] == "white"){
        				a = a.concat(white);
            		}
            		if(this.colorSettings["1"] == "sharp" || this.colorSettings["2"] == "bemol"){
            			a = a.concat(black);
            		}
            		if(a.length == 0){
            			a = a.concat(white);
            			a = a.concat(black);
            		}
            		
            		while(1){
            			var x = Math.floor(Math.random() * a.length);
            			if(this.aXgenerated != a[x]){
            				this.aXgenerated = a[x];
            				this.generatedFullNumbers[this.generatedFullNumbers.length] = a[x];
            				break;
            			}
            		}
            		
        			this.generatedAccord.length = 0;
        			
    				var z = 0, y = 1;
    				if(this.colorSettings["1"] == "sharp")z+= 1;
    				if(this.colorSettings["2"] == "bemol")z+= 1;
    				if(z == 0)z+= 2;
    				if(z == 1){
    					if(this.colorSettings["2"] == "bemol")y -= 1;
    				} else{
    					y = Math.round(Math.random());
    				}
    				
        			switch(a[x]){
        			case 0: case 12:
        				this.generatedAccord[this.generatedAccord.length] ="C";
        			break;
        			case 2: case 14:
        				this.generatedAccord[this.generatedAccord.length] ="D";
        			break;
        			case 4: case 16:
        				this.generatedAccord[this.generatedAccord.length] ="E";
        			break;
        			case 5: case 17:
        				this.generatedAccord[this.generatedAccord.length] ="F";
        			break;
        			case 7: case 19:
        				this.generatedAccord[this.generatedAccord.length] ="G";
        			break;
        			case 9: case 21:
        				this.generatedAccord[this.generatedAccord.length] ="A";
        			break;
        			case 11: case 23:
        				this.generatedAccord[this.generatedAccord.length] ="B";
        			break;
        			case 1: case 13:
        				if(y == 1){var ac = "C",av = "#";}else{var ac = "D",av = "b";}
        				this.generatedAccord[this.generatedAccord.length] = ac;
        				this.generatedAccord[this.generatedAccord.length] = av;
        			break;
        			case 3: case 15:
        				if(y == 1){var ac = "D",av = "#";}else{var ac = "E",av = "b";}
        				this.generatedAccord[this.generatedAccord.length] = ac;
        				this.generatedAccord[this.generatedAccord.length] = av;
        			break;
        			case 6: case 18:
        				if(y == 1){var ac = "F",av = "#";}else{var ac = "G",av = "b";}
        				this.generatedAccord[this.generatedAccord.length] = ac;
        				this.generatedAccord[this.generatedAccord.length] = av;;
        			break;
        			case 8: case 20:
        				if(y == 1){var ac = "G",av = "#";}else{var ac = "A",av = "b";}
        				this.generatedAccord[this.generatedAccord.length] = ac;
        				this.generatedAccord[this.generatedAccord.length] = av;
        			break;
        			case 10: case 22:
        				if(y == 1){var ac = "A",av = "#";}else{var ac = "B",av = "b";}
        				this.generatedAccord[this.generatedAccord.length] = ac;
        				this.generatedAccord[this.generatedAccord.length] = av;
        			break;
        			}
        			this.show_accord_on_keyboard("#0ff");
        			
        			$("#blockKeys").show();
        		}
    		}
    	},
    	render_keyboard:function(){
    		for(var v in this.keyboard){
    			this.keyboard[v].attr({fill:this.keyboard[v].data("color_keys")});
    		}
    		for(var v in this.enteredNumbers){
    			this.keyboard[this.enteredNumbers[v]].attr({fill:"#00f"});
    		}
    	},
    	count_elements_in_array:function(array){
    		var i = 0;
    		for(var j in array){
    			i++;
    		}
    		return i;
    	},
    	show_accord_on_keyboard:function(color){
    		this.enteredNumbers.length = 0;
    		for(var v in this.keyboard){
    			this.keyboard[v].attr({fill:this.keyboard[v].data("color_keys")});
    		}
    		for(var v in this.generatedFullNumbers){
    			this.keyboard[this.generatedFullNumbers[v]].attr({fill:color});
    		}
    	}
	};
}());