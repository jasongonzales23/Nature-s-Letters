/* Author: 
Jason Gonzales for Nature's Letters
*/

var NL= {};

NL.design = {
    numberOfLetters:0
    
}

NL.global = (function($, NL){
    var userWord;
    
    function storeWord(){
        //check to make sure user has entered something
        //check for length of word range is 3 - 10
        //check for dirty words
        // TODO store the word in a cookie in case of problems 
        //store it in the var
        userWord = $('#wordInput').val();
        userWord = userWord.toLowerCase();
        NL.design.numberOfLetters = userWord.length;
        NL.design.wordArray = userWord.split("");
        
    }
    
    function navigateToPrevNext(currentStep, destination){
        $('#'+ currentStep).hide();
        $(destination).show();
        destination = destination.substr(1);
        processDestination(destination);
    }
    
    
    function loadImageChooser(){
        //build the letter slots
        //figure out all the letter image properties like how many images there are etc
        
        //load the images
        $('#chooseImages').empty();
        $.each( NL.design.wordArray, function(key, value){
            var html = '<div class="letter">';
            html += '<a href="#up" class="upArrow"></a>';
            html += '<div class="letterImg">';
            html += '<img src="img/'+ value +'.jpg"/>';
            html += '</div>';
            html += '<a href="#down" class="downArrow"></a>';
            html += '</div>';
            $('#chooseImages').append(html);
        });
        
        NL.global.getImageStatus.calculateMarginLimit();
        NL.global.getImageStatus.margins();
        
        //need to be able to move this from step to step 
    }
    
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
            }
            if ($(this).attr('href') === "#black"){
                $frame.removeClass('brown').addClass('black');
            }
        });
        
    }
    
    function processDestination(destination) {
        switch(destination)
        {
            case 'step-1':
                break;
            case 'step-2':
                loadImageChooser();
                bindFrameButtons();
                break;
            case 'step-3':
                loadFrameAndToneChooser();
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
        console.log(currMargin);
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
        calculateMarginLimit: function ( ) {
            NL.design.marginLimitArray = Array();
             $("#chooseImages").imagesLoaded(function(){
                $('img').each(function(index, element){
                    var height = (($(this).height()) * -1) + 120;
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
            storeWord();
            navigateToPrevNext(currentStep, destination);
          break;
        case 'step-2':
            navigateToPrevNext(currentStep, destination);
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
});

