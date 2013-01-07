/*
 * Licensed to Jasig under one or more contributor license
 * agreements. See the NOTICE file distributed with this work
 * for additional information regarding copyright ownership.
 * Jasig licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file
 * except in compliance with the License. You may obtain a
 * copy of the License at:
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

PORTLET_JS_CONTROL = function(opts) {

    var nspace = opts.nspace;
    var baseUrl = opts.baseUrl;
    var rootID = opts.rootID;
    
    var autocomplete = opts.autocomplete;
    
    var messages = opts.messages;
    
    var context = this;
    
    var $ = this.jQuery;
    var $id = context.$id;
    var $class = context.$class;
    
    /*
    var selectedDomain = $("li", $id("contact-domains")).index("li[rel='selected']");
    selectedDomain = selectedDomain < 0 ? 0 : selectedDomain;
    $id("contact-domains").tabs({
        selected: selectedDomain
    });
    */
    
    $(".contactDomain a").click(function() {
        $("#"+nspace+"domainsContainer").hide();
        $('#'+$(this).attr("rel")).show();
    });
    
    $(".contactSet a").click(function() {
        $(".setContainer").hide();
        var domain = $(this).closest(".contact-domain");
        $("#"+nspace+"contactContainer ul").empty();
        $("#"+nspace+"contactContainer div[data-role=header] h1").html($(this).text());
        $("#"+nspace+"contactContainer ul").load($(this).attr("rel"), function() {
            $("#"+nspace+"contactContainer ul").listview({});
            $("#"+nspace+"contactContainer").trigger("ContactsLoaded");
            $(document).trigger('mobileinit');
        });
        $("#"+nspace+"contactContainer").show();
        
    });
    
    $(".setContainer .backButton").click(function() {
        $(".setContainer").hide();
        $("#"+nspace+"domainsContainer").show();
    });
    
    $("#"+nspace+"contactContainer .contactBackButton").click(function(){
        $("#"+nspace+"contactContainer").hide();
        $("#"+nspace+"domainsContainer").show();
    });
 
 
    
    $("#"+rootID).delegate("#"+nspace+"contactContainer", "ContactsLoaded", function() {
        $("ul", $(this)).each(function(index, el) {
            if(loadPhotos($(el)))
                $(el).scroll(function(evnt) {
                    if (!loadPhotos($(el)))
                        $(el).unbind(evnt);
                });
            
        });
        
    });
    var lastLoaded = 0;
    function loadPhotos(resultsArea) {
        var res = false;
        $(".contact-photo:empty", resultsArea).each(function(index, el) {
            res = true;
            var relPos = resultsArea.outerHeight() +100;
            var offset = $(el).position().top;
            if( offset < -100) {
                return true;
            } else if ( offset > relPos ) {
                return false;
            } else {
                var img = $("<img/>")
                .error( function () {
                    $(this).attr("src", baseUrl + "/images/image_unavailable.jpg");
                })
                .load( function () {
                    $(this).fadeIn();
                })
                .attr("src", $(el).attr("rel"))
                .css("display", "none");

                $(el).append(img);
            }
            
        });
        
        return res;
        
    }


   $("#"+rootID+" .searchButton").click(function () {

        var domain = $(this).closest(".setContainer");
        var resultsArea = $("#"+nspace+"contactContainer ul");
        
        var term = escape($("input[name=searchtext]", domain).val());
        var filter = escape($("select[name=filter]", domain).val());
        
        var url = $(this).closest(".searchForm").attr("action");
        url = url.replace(escape("||FILTER||"), filter);
        url = url.replace(escape("||TERM||"), term);
        
        
        resultsArea.contents().remove();

        resultsArea.load(url, function() {
            //domain.trigger("ContactsLoaded");
            domain.hide();
            $("#"+nspace+"contactContainer div[data-role=header] h1").html("Search "+filter+" : "+term);
            $("#"+nspace+"contactContainer").trigger("ContactsLoaded");
            $("#"+nspace+"contactContainer").show();
        });        
        
        
        
        return false;
    });
    
/*
    $("#"+rootID+" .contact-domain").delegate(".contact-photo", "appear", function() {
        var img = $(this).attr("rel");
        $(this).attr("style", "background-image: url('"+img+"')");
    });
    */
}

                   
