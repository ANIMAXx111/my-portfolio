

!function($){

    "use strict";

    var Typed = function(el, options){


        this.el = $(el);


        this.options = $.extend({}, $.fn.typed.defaults, options);


        this.baseText = this.el.text() || this.el.attr('placeholder') || '';


        this.typeSpeed = this.options.typeSpeed;


        this.startDelay = this.options.startDelay;


        this.backSpeed = this.options.backSpeed;


        this.backDelay = this.options.backDelay;


        this.strings = this.options.strings;


        this.strPos = 0;


        this.arrayPos = 0;

       
        this.stopNum = 0;

        
        this.loop = this.options.loop;
        this.loopCount = this.options.loopCount;
        this.curLoop = 0;

        
        this.stop = false;

        
        this.showCursor = this.isInput ? false : this.options.showCursor;


        this.cursorChar = this.options.cursorChar;


        this.isInput = this.el.is('input');
        this.attr = this.options.attr || (this.isInput ? 'placeholder' : null);

!
        this.build();
    };

        Typed.prototype =  {

            constructor: Typed

            , init: function(){


                var self = this;
                self.timeout = setTimeout(function() {

                    self.typewrite(self.strings[self.arrayPos], self.strPos);
                }, self.startDelay);
            }

            , build: function(){

                if (this.showCursor === true){
                  this.cursor = $("<span class=\"typed-cursor\">" + this.cursorChar + "</span>");
                  this.el.after(this.cursor);
                }
                this.init();
            }


            , typewrite: function(curString, curStrPos){

                if(this.stop === true)
                   return;


                var humanize = Math.round(Math.random() * (100 - 30)) + this.typeSpeed;
                var self = this;

                
                self.timeout = setTimeout(function() {
                   
                    var charPause = 0;
                    var substr = curString.substr(curStrPos);
                    if (substr.charAt(0) === '^') {
                        var skip = 1;  
                        if(/^\^\d+/.test(substr)) {
                           substr = /\d+/.exec(substr)[0];
                           skip += substr.length;
                           charPause = parseInt(substr);
                        }

                       
                        curString = curString.substring(0,curStrPos)+curString.substring(curStrPos+skip);
                    }

                    self.timeout = setTimeout(function() {
                        if(curStrPos === curString.length) {
                          
                           self.options.onStringTyped(self.arrayPos);

                           if(self.arrayPos === self.strings.length-1) {

                              self.options.callback();

                              self.curLoop++;


                              if(self.loop === false || self.curLoop === self.loopCount)
                                 return;
                           }

                           self.timeout = setTimeout(function(){
                              self.backspace(curString, curStrPos);
                           }, self.backDelay);
                        } else {


                           if(curStrPos === 0)
                              self.options.preStringTyped(self.arrayPos);

                           
                           var nextString = self.baseText + curString.substr(0, curStrPos+1);
                           if (self.attr) {
                            self.el.attr(self.attr, nextString);
                           } else {
                            self.el.text(nextString);
                           }

                           curStrPos++;
                          
                           self.typewrite(curString, curStrPos);
                        }
                    // end of character pause
                    }, charPause);

                // humanized value for typing
                }, humanize);

            }

            , backspace: function(curString, curStrPos){
                // exit when stopped
                if (this.stop === true) {
                   return;
                }

                // varying values for setTimeout during typing
                // can't be global since number changes each time loop is executed
                var humanize = Math.round(Math.random() * (100 - 30)) + this.backSpeed;
                var self = this;

                self.timeout = setTimeout(function() {

                    // ----- this part is optional ----- //
                    // check string array position
                    // on the first string, only delete one word
                    // the stopNum actually represents the amount of chars to
                    // keep in the current string. In my case it's 14.
                    // if (self.arrayPos == 1){
                    //  self.stopNum = 14;
                    // }
                    //every other time, delete the whole typed string
                    // else{
                    //  self.stopNum = 0;
                    // }

                    // ----- continue important stuff ----- //
                    // replace text with base text + typed characters
                    var nextString = self.baseText + curString.substr(0, curStrPos);
                    if (self.attr) {
                     self.el.attr(self.attr, nextString);
                    } else {
                     self.el.text(nextString);
                    }

                    // if the number (id of character in current string) is
                    // less than the stop number, keep going
                    if (curStrPos > self.stopNum){
                        // subtract characters one by one
                        curStrPos--;
                        // loop the function
                        self.backspace(curString, curStrPos);
                    }
                    // if the stop number has been reached, increase
                    // array position to next string
                    else if (curStrPos <= self.stopNum) {
                        self.arrayPos++;

                        if(self.arrayPos === self.strings.length) {
                           self.arrayPos = 0;
                           self.init();
                        } else
                            self.typewrite(self.strings[self.arrayPos], curStrPos);
                    }

                // humanized value for typing
                }, humanize);

            }

            // Start & Stop currently not working

            // , stop: function() {
            //     var self = this;

            //     self.stop = true;
            //     clearInterval(self.timeout);
            // }

            // , start: function() {
            //     var self = this;
            //     if(self.stop === false)
            //        return;

            //     this.stop = false;
            //     this.init();
            // }

            // Reset and rebuild the element
            , reset: function(){
                var self = this;
                clearInterval(self.timeout);
                var id = this.el.attr('id');
                this.el.after('<span id="' + id + '"/>')
                this.el.remove();
                this.cursor.remove();
                // Send the callback
                self.options.resetCallback();
            }

        };

    $.fn.typed = function (option) {
        return this.each(function () {
          var $this = $(this)
            , data = $this.data('typed')
            , options = typeof option == 'object' && option;
          if (!data) $this.data('typed', (data = new Typed(this, options)));
          if (typeof option == 'string') data[option]();
        });
    };

    $.fn.typed.defaults = {
        strings: ["These are the default values...", "You know what you should do?", "Use your own!", "Have a great day!"],
        // typing speed
        typeSpeed: 0,
        // time before typing starts
        startDelay: 0,
        // backspacing speed
        backSpeed: 0,
        // time before backspacing
        backDelay: 1500,
        // loop
        loop: true,
        // false = infinite
        loopCount: false,
        // show cursor
        showCursor: true,
        // character for cursor
        cursorChar: "|",
        // attribute to type (null == text)
        attr: null,
        // call when done callback function
        callback: function() {},
        // starting callback function before each string
        preStringTyped: function() {},
        //callback for every typed string
        onStringTyped: function() {},
        // callback for reset
        resetCallback: function() {}
    };


}(window.jQuery);
