$(document).ready(function(){
    $(".nav-menu button").click(function(){
        $(".dropdown-menu").toggleClass("open");
        return false;
    });
    
    $(document).click(function(e){
        if($(".dropdown-menu").hasClass("open") && $(e.target).closest(".dropdown-menu").length === 0 ){
            $(".dropdown-menu").removeClass("open");
        }
    });
});