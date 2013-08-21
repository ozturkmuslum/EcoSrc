var siteUrl = "http://its.yaz.com.tr/EconomicResource/";
var selectedResources = "";
$(document).ready(function () {
    showWizard();
    GetEcoResources();
    GetBolgeList();
    SetDdlBolgeValueChanged();


});

function SetDdlBolgeValueChanged() {
    $('#bolge').on('change', function (e) {
        //var optionSelected = $("option:selected", this);
        var valueSelected = this.value;
        GetUlkeListInBolge(valueSelected);
    });
}


//Get Bölgedeki Ülkeler
function GetUlkeListInBolge(bolgeId) {
    $.ajax({
        url: siteUrl + "api/ecosrcapi/GetUlkeListInBolge?format=jsonp&bolgeId=" + bolgeId,
        dataType: 'jsonp',
        success: fnSuccessGetUlkeListInBolge,
        error: fnErrorGetUlkeListInBolge
    });
}

function fnSuccessGetUlkeListInBolge(data) {

    //ülkeler listesini temizliyorum
    $("#ulke option").each(function () {
        $(this).remove();
    });

    //seçinizi ekliyorum
    $('#ulke')
      .append($("<option></option>")
      .attr("value", "-1")
      .text("Seçiniz"));

    //seçilen bölgedeki ülkeleri ekliyorum
    $.each(data, function () {
        var item = this;
        $('#ulke')
            .append($("<option></option>")
            .attr("value", item.UlkeId)
            .text(item.UlkeAdi));
    });
}

function fnErrorGetUlkeListInBolge(error) {
    alert("Error =" + error.error);
}
// End Get Bölgedeki Ülkeler

function showWizard() {
    $("#wizard").bwizard({ activeIndexChanged: activeIndexChange });

    function activeIndexChange(e, ui) {
        if (ui.index == 2) {
            showResult();
        }
    }
}

function showResult() {

    setSelectedResources();

    var sorgu = {
        Resources: selectedResources,
        BolgeId: $("#bolge").val(),
        UlkeId: $("#ulke").val()
    };

    $("#sonuc").empty();
    $("#yukleniyor").show();
    GetKurumBilgileri(sorgu);
}

// Get Kurum Bilgileri
function GetKurumBilgileri(sorgu) {
    $.ajax({
        type: 'GET',
        url: siteUrl + "api/ecosrcapi/GetKurumBilgileri?format=jsonp",
        dataType: 'jsonp',
        data: sorgu,
        success: fnSuccessGetKurumBilgileri,
        error: fnErrorGetKurumBilgileri
    });
}

function fnSuccessGetKurumBilgileri(data) {
    $("#yukleniyor").hide();

    var html = $("<div></div>")
             .attr("class", "tabbable tabs-left");

    //bölgelerde  dönüyorum ve tab isimlerini oluşturuyorum
    var tabmenu = '<ul class="nav nav-tabs">';
    $.each(data, function (i, item) {
        if (i == 0) {
            tabmenu += '<li class="active"><a href="#A' + i + '" data-toggle="tab"> ' + item.BolgeAdi + '</a></li>';
        } else {
            tabmenu += '<li><a href="#A' + i + '" data-toggle="tab">' + item.BolgeAdi + '</a></li>';
        }
    });
    tabmenu += "</ul>";
    html.append(tabmenu);


    //Bölgelerin içindeki ülkelerde dolaşıyorum ve ülkeleri listesini ekliyorum   
    var content = '<div class="tab-content">';
    $.each(data, function (ii, item) {
        if (ii == 0) {
            content += '<div class="tab-pane active" id="A' + ii + '"> ' + ulkeleriGoster(item.Html) + '</div>';
        } else {
            content += '<div class="tab-pane" id="A' + ii + '">' + ulkeleriGoster(item.Html) + '</div>';
        }
    });
    content += '</div>';

    html.append(content);

    $("#sonuc").empty().html(html);
    $("[id^='treeTable']").treetable({ expandable: true });
    $("[id^='treeTable']").treetable('expandAll');
}


function ulkeleriGoster(html) {

    var sonuc=$("<div></div>").html(html);
    return sonuc.html();
}

function fnErrorGetKurumBilgileri(error) {
    $("#yukleniyor").hide();
    alert("Error =" + error.error);
}
// end Get Kurum Bilgileri

function setSelectedResources() {
    //var ids = new Array();
    selectedResources = "";
    $("#tree").find("input:checked").each(function (i, ob) {
        //ids.push($(ob).val());
        selectedResources = selectedResources + $(ob).val() + "-";
    });
}

function GetEcoResources() {
    $.ajax({
        url: siteUrl + "api/ecosrcapi/GetEcoResources?format=jsonp",
        dataType: 'jsonp',
        crossDomain: true,
        success: fnSuccessGetEcoResources,
        error: fnErrorGetEcoResources
    });
}

function fnSuccessGetEcoResources(data) {
    $('#tree').aciTree({
        rootData: data,
        checkbox: true,
        checkboxName: 'checkbox1[]'
    });
}

function fnErrorGetEcoResources(error) {
    alert("Error =" + error.error);
}

//End Get Economic Resources

// Get Economic Resources
function GetSelectedEcoResources(ids) {
    $.ajax({
        url: siteUrl + "api/ecosrcapi/GetEcoResources?format=jsonp&ids=" + ids,
        dataType: 'jsonp',
        success: fnSuccessGetSelectedEcoResources,
        error: fnErrorGetSelectedEcoResources
    });
}

function fnSuccessGetSelectedEcoResources(data) {
    return data;
}

function fnErrorGetSelectedEcoResources(error) {
    alert("Error =" + error.error);
}

//End Get Economic Resources

// Get Bolge listesi
function GetBolgeList() {
    $.ajax({
        url: siteUrl + "api/ecosrcapi/GetBolgeList?format=jsonp",
        dataType: 'jsonp',
        success: fnSuccessGetBolgeList,
        error: fnErrorGetBolgeList
    });
}

function fnSuccessGetBolgeList(data) {
    $.each(data, function () {
        var item = this;
        $('#bolge')
            .append($("<option></option>")
            .attr("value", item.BolgeId)
            .text(item.BolgeAdi));
    });
}

function fnErrorGetBolgeList(error) {
    alert("Error =" + error.error);
}
//end Get bolge listesi
