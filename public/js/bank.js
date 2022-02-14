$(document).ready(function(){
    $(".table").hide();
    $("#table-deposit").show();

    $("#nav-deposit").click(function(){
        $(".history-btn").removeClass("active text-success text-warning text-danger")
        $(this).addClass("active text-success")
        $(".table").hide();
        $("#table-deposit").show(500);
    })

    $("#nav-withdraw").click(function(){
        $(".history-btn").removeClass("active text-success text-warning text-danger")
        $(this).addClass("active text-danger")
        $(".table").hide();
        $("#table-withdraw").show(500);
        
    })

    $("#nav-transfer-withdraw").click(function(){
        $(".history-btn").removeClass("active text-success text-warning text-danger")
        $(this).addClass("active text-warning")
        $(".table").hide();
        $("#table-transfer-withdraw").show(500);
    })

    $("#nav-transfer-deposit").click(function(){
        $(".history-btn").removeClass("active text-success text-warning text-danger")
        $(this).addClass("active text-warning")
        $(".table").hide();
        $("#table-transfer-deposit").show(500);
    })

    $("#btn-deposit").click(function(){
        $("#submit-deposit").focus().click();
    })


    $("#btn-withdraw").click(function(){
        $("#submit-withdraw").focus().click();
    })

    $("#btn-transfer").click(function(){
        $("#submit-transfer").focus().click();
    })
})
