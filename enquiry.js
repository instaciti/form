(function ($) {
  "use strict";
  $("input").keyup(function (e) {
    if (e.target.id !== "txtSearchProducts") {
      EnquiryChange();
    }
  });

  //$(".cManikSubmitEnquiry").click(function (event) {
  //    event.preventDefault();
  //    var oEnqElements = document.querySelector('.cContactForm').querySelectorAll("form")[0];

  //    if (!ValidatePostedData(oEnqElements)) {
  //        return;
  //    }

  //    let CaptchaData = JSON.parse(localStorage.getItem("CaptchaData"));
  //    if (CaptchaData.isTrusted) {
  //        localStorage.removeItem("CaptchaData");
  //        let PostedData = [];

  //        for (let i = 0; i < oEnqElements.length; i++) {
  //            if (oEnqElements[i].type === "text" || oEnqElements[i].type === "email" || oEnqElements[i].type === "textarea" ||
  //                oEnqElements[i].type === "radio" || oEnqElements[i].type === "checkbox" || oEnqElements[i].type === "select") {
  //                let body = {};
  //                body["ItemName"] = oEnqElements[i].id.split('_')[1];
  //                body["ItemValue"] = oEnqElements[i].value;
  //                PostedData.push(body);
  //            }
  //        }

  //        SubmitEnquiry(PostedData);
  //    }
  //    else {
  //        return;
  //    }
  //});

  $(document).ready(function () {
    $(document).on("click", ".cManikSubmitEnquiry", function (e) {
      e.preventDefault();
      var oEnqElements = $(this).parents('form:first')[0];
      if (!ValidatePostedData(oEnqElements)) {
        return;
      }
    
     // localStorage.removeItem("CaptchaData");
      let PostedData = [];

      for (let i = 0; i < oEnqElements.length; i++) {
        if ((oEnqElements[i].type === "text" || oEnqElements[i].type === "email" || oEnqElements[i].type === "textarea" ||
          oEnqElements[i].type === "radio" || oEnqElements[i].type === "checkbox" || oEnqElements[i].type === "select" || oEnqElements[i].type === 'tel') && (oEnqElements[i].id.indexOf('recaptcha') <= -1)) {
          let body = {};
          let ManikClass = oEnqElements[i].getAttribute("class").split(' ')[1];
          if (ManikClass === "cEnqValue") {
            body["ItemName"] = oEnqElements[i].name;
            body["ItemValue"] = oEnqElements[i].value;
            oEnqElements[i].value = "";
            PostedData.push(body);
          }
        }
        else if (oEnqElements[i].type === "file") {
          //  
        }
      }

      SubmitEnquiry(e, PostedData);
      //SubmitEnquiry(PostedData);
    });

    // $("input[type=file]").click(function () {
    //   $(this).val("");
    // });

    $("input[type=file]").change(function (e) {
      window['angularComponentRef'].component.FileUploadChange(e);
    });
  });


  function ValidatePostedData(oEnqElements) {
    let count = 0;
    for (let i = 0; i < oEnqElements.length; i++) {
      if (oEnqElements[i].getAttribute("required") != undefined) {
        try {
          if (oEnqElements[i].value === "" && (oEnqElements[i].type === "text" || oEnqElements[i].type === "email" || oEnqElements[i].type === "textarea" ||
            oEnqElements[i].type === "radio" || oEnqElements[i].type === "checkbox" || oEnqElements[i].type === "select" || oEnqElements[i].type === "tel")) {
            $("#" + oEnqElements[i].id + "").css("border", "1px solid red");
            count++;
          }
        }
        catch (err) {
          console.log(err);
        }
      }
    }
    let IsValid = count ? false : true;
    return IsValid;
  }

  function EnquiryChange() {
    var oEnqElements = document.getElementById('manikDivEnquiry').querySelectorAll("form")[0];
    if (oEnqElements) {
      for (let i = 0; i < oEnqElements.length; i++) {
        try {
          if (oEnqElements[i].value !== "" && oEnqElements[i].type != "submit") {
            $("#" + oEnqElements[i].id + "").css("border", "");
          }
        }
        catch (err) {
          console.log(err);
        }
      }
    }
  }

  // function SubmitEnquiry(body) {
  //   window['angularComponentRef'].zone.run(() => {
  //     window['angularComponentRef'].component.SubmitEnquiryForm(body);
  //   });
  // }

  $(document).ready(function () {
    let currentpath = location.pathname.split('/');
    if (currentpath.length > 2) {
      try {
        $([document.documentElement, document.body]).animate({
          scrollTop: $("#anchor" + currentpath[3]).offset().top
        }, 500);
      }
      catch (e) { }
    }

    $(document).on("click", ".cActiveMenu", function (e) {
      e.preventDefault();
      $([document.documentElement, document.body]).animate({
        scrollTop: $("#anchor" + e.currentTarget.id).offset().top
      }, 500);

      let bizHandle = location.pathname.split('/')[1];
      let url;
      if (bizHandle === "edit") {
        url = location.pathname + "/" + e.currentTarget.id;
      }
      else {
        url = bizHandle + "/" + e.currentTarget.id;
      }

      UpdateURL(e.currentTarget.id, url);
    });

    $("#ManikEcommIcon").click(function () {
      $([document.documentElement, document.body]).animate({
        scrollTop: $("#anchorOnline-Store").offset().top
      }, 500);
    });

    function UpdateURL(title, url) {
      if (typeof (history.pushState) != "undefined") {
        var obj = { Title: title, Url: url };
        history.pushState(obj, obj.Title, obj.Url);
      } else {
        alert("Browser does not support HTML5.");
      }
    }
  });

  function SubmitEnquiry(e, body) {
    e.preventDefault();
    grecaptcha.ready(function () {
      grecaptcha.execute('6LdLrLgZAAAAADIdKNxF3ssto0vf21xhmX4IP6OF', { action: 'submit' }).then(function (token) {
        window['angularComponentRef'].component.VerfiyCaptch(token, body);
      });
    });
  }
}(jQuery));
