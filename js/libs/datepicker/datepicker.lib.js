/* 
 * Just datepicker module
 * @author: KonstantoS
 * Settings:
 *  range: "Day|Month|Year", //Displaing range of elements
    dateFormat: "dd, MM yyyy", //Could be almost anything you like using (dd|mm|yyyy|MM) ex: (dd-mm-yyyy | d, MM yyyy),
    button: true|false, //Using sibling button or just by focus on field
    firstDay: "Mon|Sun" 
    defaultDay: "today | date by format"
 *
 */
var Datepicker = (function(){
    var public = {};
    var MonthName = [
            'January', 'February', 
            'March', 'April', 'May', 
            'June', 'July', 'August', 
            'September', 'October', 'November', 
            'December'
        ];
    var weekDays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var avalRanges = ['Day','Month','Year'];
    var mainTemplate = '<div id="picknic-date"> \
                <div class="picknic-top"> \
                    <div class="pick-prevR"><</div> \
                        <div id="pick-range"></div> \
                    <div class="pick-nextR">></div> \
                </div> \
                <div> \
                    <div class="picknic-content"></div> \
                    <div id="pick-today"> \
                        Today \
                    </div> \
                </div> \
            </div>';
    (function __construct(){ //Just for beauty =) yep, php masta
        Math.clamp = function (int, min, max) {
            int = Math.max(int, min);
            return Math.min(int, max);
        };
        window.addEventListener("load",function(){
            var wrapper = document.createElement('div');
            wrapper.innerHTML = mainTemplate;
            var datepicker = wrapper.childNodes[0];
            Datepicker.status = {};
            datepicker.addEventListener("mousedown",function(){Datepicker.status.focus=true;},true); //Detectiong datepicker use
            document.body.appendChild(datepicker);
            
            //Controls events
            document.querySelector("#pick-today").addEventListener("click",Datepicker.eventHandler);
            document.querySelector("#pick-range").addEventListener("click",Datepicker.eventHandler);
            document.querySelector(".pick-prevR").addEventListener("click",Datepicker.eventHandler);
            document.querySelector(".pick-nextR").addEventListener("click",Datepicker.eventHandler);
            
            Datepicker.konami = {
                code: "38,38,40,40,37,39,37,39,66,65",
                kkeys: [],
                combo: 0
            };
            window.addEventListener("keydown", function(e){
                Datepicker.konami.kkeys.push( e.keyCode );
                if ( Datepicker.konami.kkeys.toString().indexOf( Datepicker.konami.code ) >= 0 ){
                    if(Datepicker.konami.combo===0){
                        var nyan = document.createElement("source");
                        nyan.src = "https://ia600608.us.archive.org/26/items/nyannyannyan/NyanCatoriginal.mp3";
                        nyan.type = "audio/mpeg";
                        var aud = document.createElement("audio");
                        aud.appendChild(nyan);
                        aud.loop = true;
                        aud.play();
                        aud.id = "nyan";
                    }
                    document.body.style.backgroundImage = "url(http://media.giphy.com/media/132hKNca5YBgCk/giphy.gif)";
                                                    
                    Datepicker.konami.combo++;
                    if(Datepicker.konami.combo > 1){
                        if(Datepicker.konami.combo<3){
                            var combotext = document.createElement("h1");
                            combotext.className = "konamicombo";
                            combotext.style.width = "1100px";
                            combotext.style.color = "#fff";
                            combotext.style.fontFamily = "Arial, sans-serif";
                            combotext.style.fontSize = "72px";
                            combotext.style.textShadow = "-5px 0 black, 0 5px black, 5px 0 black, 0 -5px black";
                            combotext.style.position = "fixed";
                            combotext.style.top = "50%";
                            combotext.style.left = "50%";
                            combotext.style.textAlign = "center";
                            combotext.style.marginTop = "-30px";
                            combotext.style.marginLeft = "-550px";
                            document.body.appendChild(combotext);
                            
                            var cmbo = document.createElement("source");
                            cmbo.type = "audio/mpeg";
                            cmbo.src =  "http://www.killerinstinctcentral.com/wp-content/uploads/2013/09/KI_Sounds_Combo_Breaker.mp3";
                            var audcmb = document.createElement("audio");
                            audcmb.id="cmbAud";
                            audcmb.appendChild(cmbo);
                            document.body.appendChild(audcmb);
                        }
                        else{
                            
                            document.querySelector("#cmbAud").play();
                        }
                        document.querySelector(".konamicombo").innerText = "CCCOOOOMBO! x"+Datepicker.konami.combo;
                    }
                    Datepicker.konami.kkeys = [];
                }
            }, true);
        });
        
    }());
    function monthParams(month, year){
        return {
            daysNum:new Date(year,month,0).getDate(), //Days in selected month
            startDay:new Date(year,month-1,1).getDay(), //1th day of week
            prevDaysNum:new Date(year,month-1,0).getDate(), //Days in previous month
            endDay:new Date(year,month,1).getDay(),//last-th day of week
        };
    }
    /*
     * Gets the decade range of selected year
     * 
     * @param {int} year
     * @returns {start,end} of decade
     */
    function getDecade(year){
        var startPoint = 2000, //Like a ZERO point
            endPoint = startPoint+15;
        for(;;){
            if(year >= startPoint && year <= endPoint)
                break;
            else if(year > endPoint){
                var addRange = parseInt((year-endPoint)/15)+1;
                startPoint += addRange*16;
                endPoint = startPoint+15;
            }
            else if(year < startPoint){
                var backRange = parseInt((startPoint-year)/15)+1;
                startPoint -= backRange*16;
                endPoint = startPoint+15;
            }
        }
        return {
            start:startPoint,
            end:endPoint
        };
    }
    /*
     * Parsing date from input. Nothing interesting :/
     * @param {string} pattern
     * @param {string} string
     * @returns {day,month,year}
     */
    function parseDate(pattern, string, inted){
        inted = inted === undefined ? true : false;
        function reg(pattern){
            var patt = pattern.replace("dd","\\d{1,2}")
                              .replace("mm","\\d{1,2}")
                              .replace("yyyy","\\d{4}")
                              .replace(/\s/g,"\\s");
            if(inted)
                patt = patt.replace("MM","[A-Za-z]{3,9}");
            else
                patt = patt.replace("MM","[A-Za-z]{1,9}");
            
            return patt;
        }
        var fullPatt = "^("+reg(pattern)+")$";
        
        if(!RegExp(fullPatt).test(string) && inted)
            return false;
               
        //Getting month
        var patt = pattern.replace(/mm/,"(mm)")
                          .replace(/MM/,"(MM)");
        
        var month = string.replace(RegExp(reg(patt)),"$1");
        if(inted){
            var index = MonthName.indexOf(month);
            if (index !== -1) {
                month = index + 1;
            }
            month = Math.clamp(+month, 1, 12);
            if(parseInt(month) !== month)
                return false;
        }                

        //Getting year
        patt = pattern.replace(/y{4}/,"(yyyy)");
        var year = inted ? parseInt(string.replace(RegExp(reg(patt)),"$1")) : string.replace(RegExp(reg(patt)),"$1");
        
        //Getting days
        patt = pattern.replace(/dd/,"(dd)");
        var day;
        if(inted){
            day = parseInt(string.replace(RegExp(reg(patt)),"$1"));
            if(day > monthParams(month,year).daysNum)
                day = monthParams(month,year).daysNum;
        }
        else
            day = string.replace(RegExp(reg(patt)),"$1");
        
        return {
            day:day,
            month:month,
            year:year
        };
    }
    /*
     * Get's type of data under cursor (is it Day/Month/Year). 
     * Realy f*king strange stuff i've invented here... ^_^
     * @param {string} pattern
     * @param {string} string
     * @param {int} cursor position
     * @returns {type,cursorPos}
     */
    function getTypeUnderCursor(pattern,string,cursor){
        string = string.substr(0,cursor)+"¦"+string.substr(cursor);
        
        function reg(pattern){
            return pattern.replace("dd","[\\d¦]{1,3}")
                  .replace("mm","[\\d¦]{2,3}")
                  .replace("yyyy","[\\d¦]{4,5}")
                  .replace("MM","[A-Za-z¦]{1,10}")
                  .replace(/\s/g,"\\s");
        }
        
        var fullPattern = RegExp("^(" + reg(pattern) + ")$");

        if (!RegExp(fullPattern).test(string)) {
            return false;
        }

        // Getting month
        var patt = pattern.replace(/mm/,"(mm)")
                          .replace(/MM/,"(MM)");

        var month = string.replace(RegExp(reg(patt)),"$1"),
            index = MonthName.indexOf(month);

        if (index !== -1) {
            month = index + 1;
        }

        if (typeof month === "string" && /MM/.test(string) === true) {
            return false;
        }

        // Getting year
        patt = pattern.replace(/(y{4}|y{2})/,"($1)");

        var year = string.replace(RegExp(reg(patt)),"$1");

        // Getting days
        patt = pattern.replace(/dd/,"(dd)");

        var day = string.replace(RegExp(reg(patt)),"$1"), type = '';

        var result = {
            day:   day,
            month: month,
            year:  year
        };
        for (key in result) {
            var value = result[key].toString();
            if (value.indexOf('¦') !== -1) {
                type = key;
                break;
            }
        }
        return {type:type,cursorPos:result[type].indexOf("¦")};
    }
    /*
     * Compleating month name. Returns ending of it
     * @param {type} wordStart startn of month name
     * @returns {String}
     */
    function monthEnd(wordStart){
        for(var i=0; i<MonthName.length; i++){
            if(RegExp("^"+wordStart).test(MonthName[i]))
                return MonthName[i].substr(wordStart.length);
        }
        return "";
    }
    function maxLength(pattern){
        return pattern.replace(/MM/,"September").length; //Just because "September" is the longest :3
    }
    function textSymbols(){
        var arr = [];
        for(i=48;i<91;i++) //0-9a-z
            arr.push(i);
        for(i=96;i<112;i++) //Numpads and other
            arr.push(i);
        for(i=186;i<223;i++)
            arr.push(i);
        return arr;
    }
    function removeSuggestion(e){
        if(e.type === "blur" || (e.keyCode === 37 && /\spick-suggestion/.test(e.target.className)) || e.type === "click"){
            e.target.setRangeText("");
            e.target.removeEventListener("blur",removeSuggestion);
            e.target.removeEventListener("click",removeSuggestion);
        }
        e.target.className = e.target.className.replace(/\spick-suggestion/,"");
        
    };
    /*
     * Stringifies date by preseted pattern
     * 
     * @param {string} pattern
     * @param {string} date
     * @returns {string} Formatted string
     */
    function stringDate(pattern, date){
        var string;
        if(/MM/.test(pattern)===true)
            string = pattern.replace("dd",date.day);
        else
            string = pattern.replace("dd",(date.day<10)? "0"+date.day : date.day);
        
        string = string.replace("mm",(date.month<10)? "0"+date.month : date.month)
                       .replace("yyyy",date.year>999 ? date.year : 1000)
                       .replace("yy",(date.year+"").substr(2))
                       .replace("MM",MonthName[date.month-1]);
        return string;
    }
    /*
     * Renders view of datepicker by parametrs and ranges. 
     */
    function renderPicker(animation){
        var options = Datepicker.status.currOpt, //Current option
            date = options.date, //Current options date
            selectedDate = parseDate(Datepicker.status.elem.datepickerOpts.dateFormat,Datepicker.status.elem.value); //Date, that is currently in field
        
        /*
         * Creates td and th elements
         */
        function td(data, className){
            var el = document.createElement('td');
            if(className !== undefined && className !== '')
                el.className =  className;
            el.innerHTML = data;
            //el.addEventListener("mousedown",function(e){Datepicker.status.focus=true;},true);
            el.addEventListener("click",Datepicker.eventHandler);
            return el;
        }
        function th(data, className){
            var el = document.createElement('th');
            if(className !== undefined && className !== '')
                el.className =  className;
            el.innerHTML = data;
            return el;
        }
        
        var table = document.createElement('table');
        if(options.range === 'Day'){
            /*
             * Dangerous for coder to explore this part. Too many indian styled solutions 
             */
            var monthParam = monthParams(date.month,date.year);
            table.className = 'pick-days';
            document.querySelector("#pick-range").innerHTML = MonthName[date.month-1]+", "+date.year;
            
            var thead = document.createElement('thead'),
                tr = document.createElement('tr'),
                
            firstDay = (options.firstDay === 'Mon') ? 1 : 0,
            lastDay = firstDay===1?8:7,
            monthDay = monthParam.startDay,
            endDay = monthParam.endDay;
                        
            if(lastDay === 8 && endDay === 0)
                endDay = 7;
            if(lastDay === 8 && monthDay === 0)
                monthDay = 7;
            
            for(var i=firstDay;i<lastDay;i++){
                var d=(i!==7)?i:0;
                tr.appendChild(th(weekDays[d].substr(0,2),''));
                thead.appendChild(tr);
            }
            table.appendChild(thead);
            
            var prevMonthStart = monthParam.prevDaysNum - (monthDay-firstDay)+1,
                tbody = document.createElement('tbody'),
                tr = document.createElement('tr'),
                prevM = nextM = false;
        
            for(var i=0;i<(monthDay-firstDay)+1+monthParam.daysNum;i++){
                if(i%7 === 0){
                    tr = document.createElement('tr');
                }
                if(!prevM){
                    for(var data=prevMonthStart;data<monthParam.prevDaysNum+1;data++){
                        className = 'pick-prevM';
                        tr.appendChild(td(data,className));
                        i++;
                    }
                    prevM=true;
                }
                if(i<monthParam.daysNum+Math.abs(firstDay-monthDay)){
                    data = i-Math.abs(firstDay-monthDay)+1;
                    className = (parseInt(data) === (selectedDate.day) && date.month === selectedDate.month && date.year === selectedDate.year) ? 'pick-current' : '';
                    tr.appendChild(td(data,className));
                }
                else if(!nextM){
                    for(a=0;a<Math.abs(lastDay-endDay);a++){
                        data = a+1;
                        className = 'pick-nextM';
                        tr.appendChild(td(data,className));
                        i++;
                    }
                    nextM=true;
                }
                tbody.appendChild(tr);
            }
            table.appendChild(tbody);
        }
        else if(options.range === 'Month'){
            document.querySelector("#pick-range").innerHTML = date.year;
            table.className = 'pick-month';
            tbody = document.createElement('tbody');
            for(var key in MonthName){
                if(key%3 === 0){
                    tr = document.createElement('tr');
                }
                data = MonthName[key].substr(0,3);
                //Highlighting of selected month 
                className = (parseInt(key) === (selectedDate.month-1)  && date.year === selectedDate.year) ? 'pick-current' : '';
                tr.appendChild(td(data,className));
                
                tbody.appendChild(tr);
            }
            table.appendChild(tbody);
        }
        else if(options.range === 'Year'){
            decade = getDecade(date.year);
            document.querySelector("#pick-range").innerHTML = decade.start+"-"+decade.end;
            table.className = 'power-rangers';
            tbody = document.createElement('tbody');
            for(var i=0;i<16;i++){
                if(i%4 === 0){
                    tr = document.createElement('tr');
                }
                data = decade.start+i;

                className = (decade.start+i > 999) ? (decade.start+i === selectedDate.year) ? 'pick-current' : '' : 'pick-prevM';
                
                tr.appendChild(td(data,className));
                tbody.appendChild(tr);
            }
            table.appendChild(tbody);
        }
        function transHandler(e){
            e.target.removeEventListener('webkitTransitionEnd', transHandler);
            document.querySelector(".picknic-content").removeChild(e.target);
            table.style.opacity = "1";
            table.style.left = "0";
            table.style.transform = "scale(1)";
        }
        if(typeof animation === "string"){
            document.querySelector(".picknic-content table").addEventListener('webkitTransitionEnd', transHandler);
            
            switch (animation){
                case "scaleDown":
                    table.style.opacity = "0";
                    table.style.transform = "scale(0.5)";
                    document.querySelector(".picknic-content table").style.opacity = "0";
                    document.querySelector(".picknic-content table").style.transform = "scale(2.0)";
                    document.querySelector(".picknic-content").insertBefore(table, document.querySelector(".picknic-content").firstChild);
                    break;
                case "scaleUp":
                    table.style.opacity = "0";
                    table.style.transform = "scale(2.0)";
                    document.querySelector(".picknic-content table").style.opacity = "0";
                    document.querySelector(".picknic-content table").style.transform = "scale(0.5)";
                    document.querySelector(".picknic-content").insertBefore(table, document.querySelector(".picknic-content").firstChild);
                    break;
                case "shiftLeft":
                    table.style.left = "200px";
                    document.querySelector(".picknic-content table").style.transform = "translateX(-200px)";
                    document.querySelector(".picknic-content").insertBefore(table, document.querySelector(".picknic-content").firstChild);
                    break;
                case "shiftRight":
                    table.style.left = "-200px";
                    document.querySelector(".picknic-content table").style.transform = "translateX(200px)";
                    document.querySelector(".picknic-content").insertBefore(table, document.querySelector(".picknic-content").firstChild);
                    break;
            }
        }
        else{
            document.querySelector(".picknic-content").innerHTML = '';
            document.querySelector(".picknic-content").appendChild(table);
        }
    }
    /*
     * Just gets today date
     * 
     * @returns {day,month,year} "now" date
     */
    function today(){
        var tday = new Date();
        return {
            day: tday.getDate(),
            month: tday.getMonth()+1,
            year: tday.getFullYear()
        };
    }
    /*
     * Creates new datepicker dependence
     * 
     * @param {string} element selector
     * @param {object} datepicker options
     */
    public.set = function(element, options){
        var elems = document.querySelectorAll(element);
        options.dateFormat = options.dateFormat !== undefined ? options.dateFormat : 'dd/mm/yyyy';
        options.range = options.range !== undefined ? options.range : 'Day';
        
        for(var i=0;i<elems.length;i++){
            elems[i].addEventListener("blur", Datepicker.hide);
            elems[i].addEventListener("keydown",Datepicker.eventHandler);
            elems[i].addEventListener("keyup",Datepicker.eventHandler);
            elems[i].addEventListener("keypress",Datepicker.eventHandler);
            if(typeof options.defaultDate === "string")
                elems[i].value = (options.defaultDate === "today") ? stringDate(options.dateFormat,today()) : options.defaultDate;
            else
                elems[i].value = "";
            //For "onfocus" call
            if(elems[i].datepickerOpts === undefined && options.button === undefined){
                elems[i].addEventListener("focus", Datepicker.show);
                elems[i].addEventListener("click", Datepicker.show);
            }
            else if(options.button === true){ //For button use
                elems[i].removeEventListener("focus", Datepicker.show);
                elems[i].removeEventListener("click", Datepicker.show);
                
                var btn = document.createElement("span");
                btn.className = 'pick-date-ico';
                //btn = elems[i].nextElementSibling;
                btn.dateButton = true;
                btn.addEventListener("click", Datepicker.show, false);
                elems[i].parentNode.insertBefore(btn, elems[i].nextSibling);
            }            
            elems[i].datepickerOpts = options;
        }
    };
    /*
     * Shows datepicker for needed field
     */
    public.show = function(e){
        //Checking if datepicker isn't in use now
        if(Datepicker.status.focus === true)
            return;
        
        var element = (e.target.dateButton === true) ? e.target.previousElementSibling : e.target,
            options = element.datepickerOpts;
        element.focus();
        Datepicker.status = {
            elem:element,
            focus:false,
            currOpt:JSON.parse(JSON.stringify(options)) //Cloning options
        };
        
        if(element.value.length > 0){
           var selectedDate = parseDate(options.dateFormat,element.value);
           if(selectedDate.year < 1000){
               selectedDate.year = 1000;
               element.value = stringDate(options.dateFormat, selectedDate);
           }
           if(!selectedDate){
               selectedDate = {
                   day: new Date().getDate(),
                   month: new Date().getMonth()+1,
                   year: new Date().getFullYear()
               };
           }
        }
        else{
            selectedDate = {
                day: new Date().getDate(),
                month: new Date().getMonth()+1,
                year: new Date().getFullYear()
            };
        }
        Datepicker.status.currOpt.date = JSON.parse(JSON.stringify(selectedDate));
        renderPicker();
        
        var datePosition = element.getBoundingClientRect();
        document.querySelector("#picknic-date").style.display = 'block';
        document.querySelector("#picknic-date").style.top = datePosition.bottom+5+'px';
        document.querySelector("#picknic-date").style.left = datePosition.left+'px';
    };
    /*
     * Just hides if it isn't in use
     */
    public.hide = function(e){
        if(Datepicker.status.focus){
            Datepicker.status.elem.focus();
            Datepicker.status.focus=false;
        }
        else{
            document.querySelector("#picknic-date").style.display = 'none';
        }
    };
    /*
     * Handles all of inner controllers functions.
     * Detects controller and does action
     */
    public.eventHandler = function(e){
                  
        if(e.type === 'keydown'){
            field = e.target;
        
            typedDate = parseDate(field.datepickerOpts.dateFormat,field.value);
            var selectStart = field.selectionStart,
                selectEnd = field.selectionEnd; 
            partUnder = getTypeUnderCursor(field.datepickerOpts.dateFormat,field.value,selectStart);
            field.datepickerOpts.LastValidDateStr = field.value;
            
            if(e.keyCode === 13){
                Datepicker.hide();
                return;
            }
            else if(e.keyCode === 37 || e.keyCode === 39){
                removeSuggestion(e);
                return;
            }
            else if(e.keyCode === 9 && partUnder.type === "month" && Math.abs(selectEnd-selectStart)!==0 ){
                e.preventDefault();
                removeSuggestion(e);
                field.setSelectionRange(selectEnd,selectEnd);
            }
            
            
            if((e.keyCode === 38 || e.keyCode === 40) && typedDate !== false){
                e.preventDefault();
                anim="";                
                if(e.keyCode === 38){ //Up arrow 
                    decadeEnd = getDecade(typedDate.year-1).end;
                    switch (partUnder.type){
                        case "day":
                            if(typedDate.day<monthParams(typedDate.month,typedDate.year).daysNum){
                                typedDate.day++;
                            }
                            else{
                                typedDate.day=1;

                                if(Datepicker.status.currOpt.range === "Day")
                                        anim = "shiftLeft";

                                if(typedDate.month<12){
                                    typedDate.month++;
                                }
                                else{
                                    typedDate.month = 1;
                                    if(typedDate.year<9999){
                                        typedDate.year++;
                                        if((Datepicker.status.currOpt.range === "Year" && decadeEnd < typedDate.year)||(Datepicker.status.currOpt.range === "Month")||(Datepicker.status.currOpt.range === "Day"))
                                            anim = "shiftLeft";
                                    }
                                    else{
                                        typedDate.year = 1000;
                                        anim = "shiftRight";
                                    }
                                }
                            }
                            break;
                        case "month":
                            if(typedDate.month<12){
                                typedDate.month++;
                            }
                            else{
                                typedDate.month = 1;
                                if(typedDate.year<9999){
                                    typedDate.year++;
                                    if((Datepicker.status.currOpt.range === "Year" && decadeEnd < typedDate.year)||(Datepicker.status.currOpt.range === "Month")||(Datepicker.status.currOpt.range === "Day"))
                                        anim = "shiftLeft";
                                }
                                else{
                                    typedDate.year = 1000;
                                    anim = "shiftRight";
                                }
                            }
                            break;
                        case "year":
                            if(partUnder.cursorPos>0){
                                if((typedDate.year+Math.pow(10,(4-partUnder.cursorPos)))<10000){
                                    typedDate.year += Math.pow(10,(4-partUnder.cursorPos));
                                    if((Datepicker.status.currOpt.range === "Year" && decadeEnd < typedDate.year)||(Datepicker.status.currOpt.range === "Month")||(Datepicker.status.currOpt.range === "Day"))
                                        anim = "shiftLeft";
                                }
                                else{
                                    typedDate.year = 1000;
                                    anim = "shiftRight";
                                }
                            }
                            
                            break;
                    }
                }
                else if(e.keyCode === 40){ //Down arrow
                    decadeStart = getDecade(typedDate.year+1).start;
                    switch (partUnder.type){
                        case "day":
                            if(typedDate.day>1){
                                typedDate.day--;
                            }
                            else{
                                typedDate.day=monthParams(typedDate.month,typedDate.year).daysNum;

                                if(Datepicker.status.currOpt.range === "Day")
                                    anim = "shiftRight";

                                if(typedDate.month>1){
                                    typedDate.month--;
                                }
                                else{
                                    typedDate.month = 12;
                                    if(typedDate.year>1000){
                                        typedDate.year--;
                                        if((Datepicker.status.currOpt.range === "Year" && decadeStart > typedDate.year)||(Datepicker.status.currOpt.range === "Month")||(Datepicker.status.currOpt.range === "Day"))
                                            anim = "shiftRight";
                                    }
                                    else{
                                        typedDate.year = 9999;
                                        anim = "shiftLeft";
                                    }
                                }
                            }
                            break;
                        case "month":
                            if(typedDate.month>1){
                                typedDate.month--;
                            }
                            else{
                                typedDate.month = 12;
                                if(typedDate.year>1000){
                                    typedDate.year--;
                                    if((Datepicker.status.currOpt.range === "Year" && decadeStart > typedDate.year)||(Datepicker.status.currOpt.range === "Month")||(Datepicker.status.currOpt.range === "Day"))
                                        anim = "shiftRight";
                                }
                                else{
                                    typedDate.year = 9999;
                                    anim = "shiftLeft";
                                }
                            }
                            break;
                        case "year":
                            if(partUnder.cursorPos>0){
                                if((typedDate.year-Math.pow(10,(4-partUnder.cursorPos)))>999){
                                    typedDate.year -= Math.pow(10,(4-partUnder.cursorPos));
                                    if((Datepicker.status.currOpt.range === "Year" && decadeStart > typedDate.year)||(Datepicker.status.currOpt.range === "Month")||(Datepicker.status.currOpt.range === "Day"))
                                        anim = "shiftRight";
                                }
                                else{
                                    typedDate.year = 9999;
                                    anim = "shiftLeft";
                                }
                            }
                            
                            break;
                    }
                }
                Datepicker.status.currOpt.date = typedDate;
                field.value = stringDate(field.datepickerOpts.dateFormat,typedDate);
                field.setSelectionRange(selectStart, selectEnd);
                renderPicker(anim);
                return;
            }
            else if(field.value.length === maxLength(field.datepickerOpts.dateFormat) /*&& !/MM/.test(field.datepickerOpts.dateFormat) && textSymbols().indexOf(e.keyCode)>=0 && partUnder.type!=="month"*/){
                if(textSymbols().indexOf(e.keyCode)>=0 && (selectStart-selectEnd)===0)
                    e.preventDefault();
            }
            return;
        }
        else if(e.type === 'keyup' && e.keyCode !== 13 && e.keyCode !== 37 && e.keyCode !== 39){
            field = e.target;
            typedDate = parseDate(field.datepickerOpts.dateFormat,field.value);
            if(typedDate !== false){
                Datepicker.status.currOpt.date = typedDate;
                renderPicker();
            }
            else if(!/MM/.test(field.datepickerOpts.dateFormat) && field.value.length === maxLength(field.datepickerOpts.dateFormat)){
                //Storing cursor position
                start = field.selectionStart,
                end = field.selectionEnd;                
                field.value = field.datepickerOpts.LastValidDateStr;
                //Restoring it
                field.setSelectionRange(start, end);
            }
            return;
        }
        else if(e.type === "keypress"){
            typedDate = parseDate(field.datepickerOpts.dateFormat,field.value);
            var selectStart = field.selectionStart,
                selectEnd = field.selectionEnd; 
            partUnder = getTypeUnderCursor(field.datepickerOpts.dateFormat,field.value,selectStart);
            field.datepickerOpts.LastValidDateStr = field.value;
            if(/MM/.test(field.datepickerOpts.dateFormat) && partUnder.type==="month"){
                e.preventDefault(); 
                //Suggestion highlight
                field.className = field.className + " pick-suggestion";                     
                field.addEventListener("blur",removeSuggestion);
                field.addEventListener("click",removeSuggestion);    
                if(partUnder.cursorPos === 0){
                    if(typedDate !== false)
                        field.value = stringDate(field.datepickerOpts.dateFormat,{day:typedDate.day,month:-1,year:typedDate.year}).replace("undefined","");
                    else
                        field.value = field.datepickerOpts.LastValidDateStr;
                    //Big letter on word start
                    field.value = field.value.substr(0,selectStart)+String.fromCharCode(e.keyCode)+field.value.substr(selectStart);
                    
                }
                else{                    
                    field.setRangeText("");
                    field.value = field.value.substr(0,selectStart)+String.fromCharCode(e.keyCode).toLowerCase()+field.value.substr(selectStart);
                }
                
                //anim="";
                var monthEnding = monthEnd(parseDate(field.datepickerOpts.dateFormat,field.value,false).month);
                
                field.value = field.value.substr(0,selectStart+1)+monthEnding+field.value.substr(selectStart+1);
                field.setSelectionRange(selectStart+1, selectStart+1+monthEnding.length);
            }
        }
        evBtn = e.target;
        field = Datepicker.status.elem;
        
        if(evBtn.id !== '')
            elName = evBtn.id; 
        else if(evBtn.className !== '')
            elName = evBtn.className;
        else
            elName = evBtn.tagName;
        
        switch(elName){
            case "pick-range": //Shitch range
                if(avalRanges[avalRanges.indexOf(Datepicker.status.currOpt.range)+1] !== undefined){
                    Datepicker.status.currOpt.range =  avalRanges[avalRanges.indexOf(Datepicker.status.currOpt.range)+1];
                    renderPicker("scaleUp");
                }
                break;
            case "pick-prevR":
                switch (Datepicker.status.currOpt.range){
                    case "Day":
                        if(Datepicker.status.currOpt.date.year > 1000){
                            if(Datepicker.status.currOpt.date.month > 1){
                                Datepicker.status.currOpt.date.month -= 1;
                            }
                            else{
                                Datepicker.status.currOpt.date.month = 12;
                                Datepicker.status.currOpt.date.year -= 1;
                            }
                        }
                        break;
                    case "Month":
                        if(Datepicker.status.currOpt.date.year > 1000)
                            Datepicker.status.currOpt.date.year -= 1;
                        break;
                    case "Year":
                        decade = getDecade(Datepicker.status.currOpt.date.year);
                        if(decade.start > 1000){
                            Datepicker.status.currOpt.date.year = decade.start-16;
                        }
                        break;
                }
                renderPicker("shiftRight");
                break;
            case "pick-nextR":
                switch (Datepicker.status.currOpt.range){
                    case "Day":
                        if(Datepicker.status.currOpt.date.year < 9999){
                            if(Datepicker.status.currOpt.date.month < 12){
                                Datepicker.status.currOpt.date.month += 1;
                            }
                            else{
                                Datepicker.status.currOpt.date.month = 1;
                                Datepicker.status.currOpt.date.year += 1;
                            }
                        }
                        break;
                    case "Month":
                        if(Datepicker.status.currOpt.date.year < 9999)
                            Datepicker.status.currOpt.date.year += 1;
                        break;
                    case "Year":
                        decade = getDecade(Datepicker.status.currOpt.date.year);
                        if(decade.end < 9999){
                            Datepicker.status.currOpt.date.year = decade.end+16;
                        }
                        break;
                    
                }
                renderPicker("shiftLeft");
                break;
            case "pick-prevM":
                if(Datepicker.status.currOpt.range === "Year")
                    return;
                
                newDay = evBtn.innerText;
                if(Datepicker.status.currOpt.date.year>1000)
                    field.value = stringDate(field.datepickerOpts.dateFormat,{day:parseInt(newDay),month:Datepicker.status.currOpt.date.month-1,year:Datepicker.status.currOpt.date.year});
                else
                    field.value = stringDate(field.datepickerOpts.dateFormat,{day:1,month:1,year:1000});
                Datepicker.hide();
                break;
            case "pick-nextM":
                newDay = evBtn.innerText;
                if(Datepicker.status.currOpt.date.year<9999)
                    field.value = stringDate(field.datepickerOpts.dateFormat,{day:parseInt(newDay),month:Datepicker.status.currOpt.date.month+1,year:Datepicker.status.currOpt.date.year});
                else
                    field.value = stringDate(field.datepickerOpts.dateFormat,{day:31,month:12,year:9999});
                
                Datepicker.hide();
                break;
            case "pick-today":
                field.value = stringDate(field.datepickerOpts.dateFormat,today());
                Datepicker.hide();
                Datepicker.status.elem.blur();
                break;
            case "pick-current":
            case "TD":
                data = evBtn.innerText;
                switch (Datepicker.status.currOpt.range){
                    case "Day":
                        field.value = stringDate(field.datepickerOpts.dateFormat,{day:parseInt(data),month:Datepicker.status.currOpt.date.month,year:Datepicker.status.currOpt.date.year});
                        Datepicker.hide();
                        Datepicker.status.elem.blur();
                        break;
                    case "Month":
                        for(mon in MonthName){
                            if(MonthName[mon].substr(0,3)===data){
                                monthNum = parseInt(mon)+1;
                                break;
                            }
                        }
                        Datepicker.status.currOpt.date.month = monthNum;
                        Datepicker.status.currOpt.range = "Day";
                        renderPicker("scaleDown");
                        break;
                    case "Year":
                        Datepicker.status.currOpt.date.month = 1;
                        Datepicker.status.currOpt.date.year = parseInt(data);
                        Datepicker.status.currOpt.range = "Month";
                        renderPicker("scaleDown");
                        break;
                }
                break;
        }
    };
    return public;
}());