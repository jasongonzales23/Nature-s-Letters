/* Author: 
Jason Gonzales for Nature's Letters
*/

var NL= {} || NL;

NL.letterMap = {
    A: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8' ],
    B: ['B1', 'B2', 'B3', 'B4'],
    C: ['C1', 'C2', 'C3', 'C5', 'C6', 'C7', 'C8' ],
    D: ['D1', 'D2', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11' ],
    E: ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E9', 'E10', 'E11' ],
    F: ['F1', 'F2', 'F4', 'F5', 'F7', 'F10'],
    G: ['G1', 'G2', 'G4', 'G6', 'G7', 'G8', 'G9', 'G10', 'G11' ],
    H: ['H1', 'H2', 'H3', 'H4', 'H5' ],
    I: ['I1', 'I2', 'I3', 'I5', 'I8', 'I9' ],
    J: ['J1', 'J2', 'J3', 'J4', 'J7', 'J8', 'J9' ],
    K: ['K1', 'K2', 'K4', 'K5', 'K6' ],
    L: ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10', 'L11', 'L12', 'L13', 'L14' ],
    M: ['M1', 'M2', 'M3', 'M4', 'M5', 'M7', 'M8' ],
    N: ['N1', 'N2', 'N5', 'N6', 'N7', 'N8'],
    O: ['O1', 'O3', 'O4', 'O5', 'O6', 'O7', 'O8', 'O9', 'O10', 'O11', 'O12', 'O13', 'O14', 'O15','O16' ],
    P: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'],
    Q: ['Q1', 'Q2', 'Q4'],
    R: ['R1', 'R2', 'R3', 'R4', 'R5', 'R6'],
    S: ['S1', 'S2', 'S3', 'S5', 'S6', 'S7' ],
    T: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T8', 'T9', 'T10', 'T11' ],
    U: ['U1', 'U2', 'U3', 'U4', 'U5', 'U6', 'U7' ],
    V: ['V1', 'V2', 'V3', 'V4', 'V5', 'V6' ],
    W: ['W1', 'W2', 'W3', 'W4', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12' ],
    X: ['X1', 'X2', 'X3', 'X4'],
    Y: ['Y1', 'Y2', 'Y3', 'Y4', 'Y5', 'Y6', 'Y7' ],
    Z: ['Z2', 'Z3', 'Z4' ],
}


NL.design = {
    numberOfLetters:0,
    marginArray:undefined,
    marginLimitArray:0,
    frameColor:'black',
    tone:'bw',
    wordArray:''    
}

NL.global = (function($, NL){
    var userWord;
    
    var warnUser = function (msg) {
        $('.msgArea').empty().append(msg);
    }
    
    var loadWordInput = function(){
        NL.design.marginArray = undefined;
        $('#wordInput').val('');
        $('#wordInput').focus();
        $('#wordInput').keyup(function(event){
            var word = $('#wordInput').val();
            var patt = /^[A-Za-z]+$/;
            var result = patt.test(word);
            if (!result && word.length > 0) {
                warnUser('Sorry you can only enter letters');
            }
            else if ( word.length === 10 ) {
                warnUser('You have 10 letters, that is the maximum!');
            }
            else{
                $('.msgArea').empty();
            }
        });
        $('.clear').click(function(){
            $('#wordInput').val('');
        });
    }
    
    
    
    function storeWord(currentStep, destination){
        //check to make sure user has entered something
        //check for length of word range is 3 - 10
        //check for dirty words
        // TODO store the word in a cookie in case of problems 
        //store it in the var
        userWord = $('#wordInput').val();
        userWord = userWord.toUpperCase();
        NL.design.numberOfLetters = userWord.length;
        NL.design.wordArray = userWord.split("");
        var patt = /^[A-Za-z]+$/g;
        var result = patt.test(userWord);
        
        if(!result) {
            warnUser('Sorry you can only enter letters, try again');
            return;
        }
        
        else if ( NL.design.numberOfLetters < 3 ) {
            warnUser('Sorry, your word needs to be between 3 and 10 letters, try again');
            loadWordInput();
        }
        else{
            $('.msgArea').empty();
            navigateToPrevNext(currentStep, destination);
        }
    }
    
    function navigateToPrevNext(currentStep, destination){
        $('.msgArea').empty();
        $('#'+ currentStep).hide();
        $(destination).show();
        destination = destination.substr(1);
        processDestination(destination);
    }
    
    
    function loadImageChooser(){
        //build the letter slots
        //figure out all the letter image properties like how many images there are etc
        $('.blanket').fadeTo(.60);
        //load the images
        $('#chooseImages').empty();
        $.each( NL.design.wordArray, function(key, value){
            var html = '<div class="letter">';
            html += '<a href="#up" class="upArrow"></a>';
            html += '<div class="letterImg">';
            html += '<img src="img/strips/'+ value +'-filmstrip-bw.jpg"/>';
            html += '</div>';
            html += '<a href="#down" class="downArrow"></a>';
            html += '</div>';
            $('#chooseImages').append(html);
        });
        
        $('#chooseImages').imagesLoaded( function($imaages){
            NL.global.getImageStatus.calculateMarginLimit();
            NL.global.getImageStatus.margins();
            $('.blanket').fadeOut();
        });
    }
    
    var checkForImages = function(currentStep, destination){
        if (destination === '#step-3'){
            if ($.inArray( 0, NL.design.marginArray) > -1){
            warnUser('You need to select an image for every letter by clicking the arrows');
            }
            else{
            navigateToPrevNext(currentStep, destination);   
            }
        }
        else{
            navigateToPrevNext(currentStep, destination);   
        }
    };
    
    
    function loadFrameAndToneChooser(){
        $('#chooseFrameAndTone').empty();
        $('#chooseImages').clone().children('.letter').unwrap().appendTo('#chooseFrameAndTone')
        .each(function(){
            $('.upArrow').remove();
            $('.downArrow').remove();
        });
        
        var $container = $('#step-3').find('.outer-center');
        $container.css("left", ((960 - $('.shadow-one').outerWidth()) / 2 ) +"px");
    }
    
    function bindFrameButtons(){
        var $frame = $('.corner-a').add('.corner-b').add('.shadow-two').add('.shadow-three');
        
        $('.frameButtons').delegate('.frameChooser', 'click', function(event){
            if ($(this).attr('href') === "#brown"){
                $frame.removeClass('black').addClass('brown');
                NL.design.frameColor = "brown";
            }
            if ($(this).attr('href') === "#black"){
                $frame.removeClass('brown').addClass('black');
                NL.design.frameColor = "black";
            }
        });
        
    }
    
    function bindToneButtons(){
        $('.toneButtons').delegate('.toneChooser', 'click', function(event){
            if ($(this).attr('href') === "#blackAndWhite"){
                if (NL.design.tone === "bw"){
                    return;
                }
                else{
                    $('.letter').each( function(index){
                        var $currImg = $(this).find('img');
                        var imgSrc = $currImg.attr('src');
                        var newSrc = imgSrc.replace("filmstrip-s", "filmstrip-bw");
                        $currImg.attr('src', newSrc);
                    });
                    NL.design.tone = "bw";
                }
                
            }
            if ($(this).attr('href') === "#sepia"){
                if (NL.design.tone === "s"){
                    return;
                }
                else{
                    $('.letter').each( function(index){
                        var $currImg = $(this).find('img');
                        var imgSrc = $currImg.attr('src');
                        var newSrc = imgSrc.replace("filmstrip-bw", "filmstrip-s");
                        $currImg.attr('src', newSrc);
                    });
                }
                NL.design.tone = "s";
            }
        });
    }
    
    function loadReviewDesign(){
    $('#reviewDesign').empty();
        $('#chooseImages').clone().children('.letter').unwrap().appendTo('#reviewDesign')
        .each(function(){
            $('.upArrow').remove();
            $('.downArrow').remove();
        });
        
        var $container = $('#step-4').find('.outer-center');
        $container.css("left", ((960 - $('#step-4 .shadow-one').outerWidth()) / 2 ) +"px");
    }

    function calculateCartStuff(){
        //console.log(NL.design.frameColor + NL.design.numberOfLetters + NL.design.tone + NL.design.wordArray);
        //console.log(NL.design.marginArray)
        var tone, frameColor, letterIndex
        pictureCode = [];
        for (i=0; i< NL.design.numberOfLetters; i++){
            var letter = NL.design.wordArray[i];
            var index = (NL.design.marginArray[i] / -120 ) - 1;
            var thinger = 'NL.letterMap.' + letter + '[' + index + ']';
            pictureCode.push(eval(thinger));
        }
        
        //translate colors 
        if(NL.design.tone === 's') {
            tone = "Sepia"
        }
        if (NL.design.tone === 'bw') {
            tone = "Black and White"
        }
        
        if(NL.design.frameColor === 'black'){
            frameColor = "Black Frame";
        }
        if(NL.design.frameColor === 'brown'){
            frameColor = "Brown Frame";
        }
        
        if(NL.design.numberOfLetters < 4 ) {
            letterIndex = 0;
        }
        if(NL.design.numberOfLetters > 3 ){
            letterIndex = NL.design.numberOfLetters - 3;
        }
        
        $('#theWord').empty().text(NL.design.wordArray.join(""));
        
        $("#numLetters option").eq(letterIndex).attr('selected', 'selected');
        var numLetterVal = $("#numLetters option").eq(letterIndex).text();
        $('.numLetterVal').empty().text(numLetterVal);
        $('#pictureCode').val(pictureCode);
        $('#frameColor').val(frameColor);
        $('.frameColor').empty().text(frameColor);
        $('#tone').val(tone);
        $('.tone').empty().text(tone);
    }
    
    function processDestination(destination) {
        switch(destination)
        {
            case 'step-1':
                loadWordInput();
                break;
            case 'step-2':
                loadImageChooser();
                break;
            case 'step-3':
                loadFrameAndToneChooser();
                bindFrameButtons();
                bindToneButtons();
                break;
            case 'step-4':
                loadReviewDesign();
                calculateCartStuff();
                break;
        }
    }
    
    //below functions need different namespace
    var advanceImg = function ( index, $imgEl, increment ){
        $imgEl.animate({
            marginTop: increment
        },
        {
            duration:600,
            easing: 'easeInOutQuart',
            complete: function(){
                //update the margins array
                NL.global.setImageStatus.margins( $imgEl, index );
                NL.global.getImageStatus.margins();
            }
        } );
    }
    
    // TODO, I think I can remove this
    var checkBounds = function ( $imgEl ) {
        var currMargin = parseInt($imgEl.css('margin-top'));
    }
    
    var getImageStatus = {
        margins: function () {
            //check to see if the margins are defined in the object
            if( NL.design.marginArray === undefined ) {
                NL.design.marginArray = Array();
                for ( i=0 ; i< NL.design.numberOfLetters; i++){
                    NL.design.marginArray.push(0);
                }
            }
            
            
            //set the margins based on what is in the array, assign classes for the bounds
            $('.letterImg').find('img').each(function(index, element){
                $this = $(this);
                $this.css( { marginTop: NL.design.marginArray[index] } );
                
                $this.parents('.letterImg').siblings('.downArrow').removeClass('disabled');
                $this.parents('.letterImg').siblings('.upArrow').removeClass('disabled');
                
                if ( NL.design.marginArray[index] === 0 ) {
                    $this.parents('.letterImg').siblings('.downArrow').addClass('disabled');
                }
                
                if ( NL.design.marginArray[index] <= NL.design.marginLimitArray[index] ) { 
                    $this.parents('.letterImg').siblings('.upArrow').addClass('disabled');
                }
            });

        },
        calculateMarginLimit: function () {
            NL.design.marginLimitArray = Array();
             $("#chooseImages").imagesLoaded(function(){
                $('.letterImg img').each(function(index, element){
                    console.log(this);
                    var height = (($(this).height()) * -1) + 120;
                    console.log(height);
                    NL.design.marginLimitArray.push(height);
                });
            });
        }
    }
    
    var setImageStatus = {
        margins: function ($imgEl, index) {
            var currMargin = parseInt($imgEl.css('margin-top'));
            NL.design.marginArray[index] = currMargin;
        }
    }
    
    function processCurStep(currentStep, destination) {
        switch(currentStep)
        {
        case 'step-1':
            storeWord(currentStep, destination);
          break;
        case 'step-2':
            checkForImages(currentStep, destination);
          break;
        case 'step-3':
            navigateToPrevNext(currentStep, destination);
          break;
        case 'step-4':
            navigateToPrevNext(currentStep, destination);
          break;
        //default:
        }
    }
    
    //@public functions
    return{
        goToStep: function(el){
            var $el = $(el);
            var destination = $el.attr('href');
            var $parent = $el.parent();
            var currentStep = $parent.attr('id');
            processCurStep(currentStep, destination);
        },
        loadWordInput:loadWordInput,
        advanceImg:advanceImg,
        checkBounds:checkBounds,
        setImageStatus:setImageStatus,
        getImageStatus:getImageStatus
    }
    }($, NL));

NL.init = (function($,NL){
    
    return {
        setBindings: function(){
            $('.next').click(function(){
                NL.global.goToStep(this);
            });
            $('.prev').click(function(){
                NL.global.goToStep(this);
            });
            //bind the arrows 
            $('#chooseImages').delegate('.upArrow', 'click', function(){
                var $this = $(this);
                if ( ! $this.hasClass('disabled') ){
                    var $imgEl = $this.siblings('.letterImg').find('img');
                    $thisParentEl = $this.parents('.letter');
                    var index = $('.letter').index($thisParentEl);
                    NL.global.advanceImg ( index, $imgEl, "-=120px");
                }
            });
            $('#chooseImages').delegate('.downArrow', 'click', function(){
                var $this = $(this);
                if ( ! $this.hasClass('disabled') ){
                    var $imgEl = $(this).siblings('.letterImg').find('img');
                    $thisParentEl = $this.parents('.letter');
                    var index = $('.letter').index($thisParentEl);
                    NL.global.advanceImg ( index, $imgEl, "+=120px");
                }
                
            });
            //TODO set bindings for refresh / back arrow / front arrow
        }
    }
    
})($, NL);


$(document).ready(function(){
    NL.init.setBindings();
    NL.global.loadWordInput();
});

