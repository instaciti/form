// (function () {
//    "use strict";
let EUIData;
window.onload = (function () {

    EUIData = JSON.parse(localStorage.getItem("eData")).manikJSon[0];

    BuildAndBindUI();

    let buttons = document.getElementsByClassName("cManikSubmitEnquiry");
    // uploadURL = '#SAVEPATH#/#FILENAME#.';
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', async function (e) {
            let oEnqElements = e.currentTarget.form.children;
            let PostedData = [];
            if (!ValidatePostedData(oEnqElements)) {
                return;
            }

            for (let j = 0; j < oEnqElements.length; j++) {
                let body = {};
                if (oEnqElements[j].type === "text" ||
                    oEnqElements[j].type === "email" ||
                    oEnqElements[j].type === "number" ||
                    oEnqElements[j].type === "textarea" ||
                    oEnqElements[j].type === "radio" ||
                    oEnqElements[j].type === "checkbox" ||
                    oEnqElements[j].type === "select" ||
                    oEnqElements[j].type === 'tel') { //&& (oEnqElements[j].id.indexOf('recaptcha') <= -1)) {

                    body["ItemName"] = oEnqElements[j].name;
                    body["ItemValue"] = oEnqElements[j].value;
                    body["BusinessHandle"] = sessionStorage.getItem("BusinessHandle");
                    body["IPAddress"] = "10.10.01.11";
                }
                else if (oEnqElements[j].type === "file") {
                    debugger;
                    let url = await UploadAttachment(oEnqElements[j]);
                    body["ItemName"] = 'Image';
                    body["ItemValue"] = url;//uploadURL + oEnqElements[j].files[0].name.split('.').pop();
                }

                //oEnqElements[j].value = "";
                if (body.ItemName) {
                    PostedData.push(body);
                }
            }

            await SubmitEnquiry(PostedData);
        });
    }

    //let nextbuttons = document.getElementsByClassName("cManikNextEnquiry");

    //for (let i = 0; i < nextbuttons.length; i++) {
    //    nextbuttons[i].addEventListener('click', function (e) {

    //    });
    //}

    //let prevbuttons = document.getElementsByClassName("cManikPrevEnquiry");
    //for (let i = 0; i < nextbuttons.length; i++) {
    //    prevbuttons[i].addEventListener('click', function (e) {

    //    });
    //}

});

async function UploadAttachment(inp) {

    var formData = new FormData();
    $.each(inp.files, function (i, file) {
        formData.append('file-' + i, file);
    });

    // let files = inp.files;
    // for (let i = 0; i < files.length; i++) {
    //    formData.append('file-' + i, files[i]);
    // }

    try {
        // #region jQuery Call Request to upload image

        let url = "";

        $.ajax({
            url: "http://imagehandler.manikworks.com/imageupload",
            type: "POST",
            headers: {
                //'Content-Type': 'application/json',
                'FolderPath': 'http://resources.manikworks.com/enquiry/docupload/4b12530d-a209-49da-9eca-245d1169f41c/100210',
                'FileName': CreateNewGUID() + "." + inp.files[0].name.split('.').pop()
            },
            data: formData,
            processData: false,
            contentType: false, //'multipart/form-data',
            async: false,
            success: function (result) {
                url = result.ManikJSon[0].JSon0[0].DocURL;
            }
        });

        return url;
        // #endregion

        //#region JavaScript Call Request to upload attachment

        // var response = await fetch('http://imagehandler.manikworks.com/imageupload', {
        //    method: "POST",
        //    headers: {
        //       //'Content-Type': 'application/json',
        //       'FolderPath': 'http://resources.manikworks.com/designer',
        //       'FileName': 'demo.png'
        //    },
        //    body: formData
        // });
        // let result = await response.json();
        // return result.ManikJSon[0].JSon0[0].DocURL;

        //#endregion
    } catch (e) {
        console.log('Server returns following error', e);
    }
}

async function SubmitEnquiry(data) {
    $.ajax({
        url: "/Home/Index",
        type: "POST",
        //headers: {
        //    //'Content-Type': 'application/json',
        //    'context': '',
        //    'lgcontext': '',
        //    'EntityActionType': '',
        //    'OperationMode': ''
        //},
        data: JSON.stringify({ "items": data }),
        //processData: false,
        //contentType: false,
        async: false,
        success: function (result) {
            url = result.ManikJSon[0].JSon0[0].DocURL;
        }
    });
}

function CreateNewGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function ValidatePostedData(oEnqElements) {
    let count = 0;
    for (let i = 0; i < oEnqElements.length; i++) {
        if (oEnqElements[i].getAttribute("required") != undefined) {
            try {
                if (oEnqElements[i].value === "" && (oEnqElements[i].type === "text" || oEnqElements[i].type === "email" || oEnqElements[i].type === "textarea" ||
                    oEnqElements[i].type === "radio" || oEnqElements[i].type === "checkbox" || oEnqElements[i].type === "select" || oEnqElements[i].type === "tel")) {
                    $("input[name=" + oEnqElements[i].name + "]").css("border", "1px solid red");
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

function BuildAndBindUI(wizardScreenID = 0) {
    let cs = wizardScreenID ? EUIData.jSon0.find(i => i.wizardScreenID === wizardScreenID) : EUIData.jSon0[0];

    let json1 = EUIData.jSon1.filter(i => i.wizardScreenID === cs.wizardScreenID);
    CreateHtml("form", null, "dvEnquiryContainer", "frm_" + cs.wizardScreenID, cs.wizardQuestionID);
    CreateHtml("h2", null, "frm_" + cs.wizardScreenID, null, null, cs.screenHeaderText);
    CreateHtml("h3", null, "frm_" + cs.wizardScreenID, null, null, cs.screenSubText);
    CreateHtml("h4", null, "frm_" + cs.wizardScreenID, null, null, cs.screenText);
    var BoxCount = 0;
    json1.forEach(item => {

        //If Have mutiple listbox in json1 then continue
        //if (BoxCount===1 && (item.fieldType === "LIST_BOX" || item.fieldType === "DROP_DOWN")) {
        //   return;
        // }

        switch (item.fieldType) {
            case "RADIOBTN":
                CreateInputHtml("radio", cs.wizardScreenID, item.wizardQuestionID, "onclick", "javascript:ShowNextQuestion(#NextQuestionID#, " + cs.wizardScreenID + ")", "frm_" + cs.wizardScreenID);
                break;
            case "LIST_BOX":
                BuildHtml("select", item.wizardQuestionID, item.wizardQuestionID, null, "frm_" + cs.wizardScreenID, "list");
                CreateHtml("option", cs.wizardScreenID, item.wizardQuestionID, null, item.wizardQuestionID, null);

                BoxCount++;
                break;
            case "DROP_DOWN":
                BuildHtml("select", item.wizardQuestionID, item.wizardQuestionID, null, "frm_" + cs.wizardScreenID);
                CreateHtml("option", cs.wizardScreenID, item.wizardQuestionID, null, item.wizardQuestionID, null);
                BoxCount++;
                break;
            case "CHECK_BOX":
                CreateInputHtml("checkbox", cs.wizardScreenID, item.wizardQuestionID, "onclick", "javascript:ShowNextQuestion(#NextQuestionID#, " + cs.wizardScreenID + ")", "frm_" + cs.wizardScreenID);
                break;
            case "COLOR":
                CreateInputHtml("color", cs.wizardScreenID, item.wizardQuestionID, null, null, "frm_" + cs.wizardScreenID);
                break;
            case "UPLOAD":
                CreateInputHtml("file", cs.wizardScreenID, item.wizardQuestionID, null, null, "frm_" + cs.wizardScreenID);
                break;
            case "MULTI_TEXT":
                CreateHtml("textarea", cs.wizardScreenID, "frm_" + cs.wizardScreenID, null, null, null);
                break;
            case "TEXT":
                CreateHtml("text", cs.wizardScreenID, "frm_" + cs.wizardScreenID, null, null, null);
                break;
        }

        /*});*/
    });
    if (wizardScreenID) {
        AddActionButtonsNext(parent, wizardScreenID);
    }
    function CreateHtml(type, wizardScreenID, parent, id, wizardQuestionID, data) {
        let json2 = EUIData.jSon2.filter(i => i.wizardQuestionID === wizardQuestionID);
        if (json2.length) {
            json2.forEach(i => {
                BuildHtml(type, i.wizardOptionID, i.wizardQuestionID, i.wizardOption, parent);
            });
        }
        else {
            BuildHtml(type, id, id, data, parent);
        }

    }

    function BuildHtml(type, id, name, data, parent, addltype = "") {
        let html = document.createElement(type);
        if (id) html.setAttribute("id", id);

        if (addltype === "list") {
            if (name) html.setAttribute("name", name + "[]");
            html.setAttribute("size", "5");
            html.setAttribute("multiple", "multiple");
        }
        else {
            if (name) html.setAttribute("name", name);
        }
        html.textContent = data;

        document.getElementById(parent).appendChild(html);
    }

    function CreateInputHtml(type, wizardScreenID, wizardQuestionID, action, callback, parent) {
        let json2 = EUIData.jSon2.filter(i => i.wizardQuestionID === wizardQuestionID);
        json2.forEach(i => {
            let html = document.createElement("input");
            html.setAttribute("type", type);

            if (i.wizardOptionID) {
                html.setAttribute("id", i.wizardOptionID);
            }
            if (name) {
                html.setAttribute("name", wizardQuestionID);
            }

            if (action && i.optNextQuestionID) {
                html.setAttribute(action, callback.replace("#NextQuestionID#", i.optNextQuestionID));
            }
            if (i.wizardOption) {
                html.setAttribute("value", i.wizardOptionID);
            }

            document.getElementById(parent).appendChild(html);
            if (type === "radio" || type === "checkbox")
                BuildHtml("label", null, null, i.wizardOption, "frm_" + i.wizardScreenID);
        });

        if (wizardScreenID) {
            // AddActionButtons(parent,wizardScreenID);
        }
    }

    function AddActionButtons(wizardScreenID, nextQuestionID, prevQuestionID) {
        let json0 = EUIData.jSon0.filter(i => i.wizardScreenID === wizardScreenID)[0];
        if (json0.showPrev === "Y" && json0.prevScreenID !== null) {
            CreateButton("btnPrev_" + wizardScreenID, "javascript:ShowPrevQuestion(" + json0.prevScreenID + "," + wizardScreenID + ")", "Prev");
        }
        if (json0.showNext === "Y" && json0.nextScreenID !== null) {
            CreateButton("btnNext_" + wizardScreenID, "javascript:ShowNextQuestion(" + json0.nextScreenID + "," + wizardScreenID + ")", "Next");
        }
        function CreateButton(id, callback, text) {
            let button = document.createElement("button");
            button.setAttribute("onclick", callback);
            button.setAttribute("id", id);
            button.textContent = text;
            document.getElementById(parent).appendChild(html);
        }
    }
    function AddActionButtonsNext(parent, wizardScreenID) {
        let json0 = EUIData.jSon0.filter(i => i.wizardScreenID === wizardScreenID)[0];        

        if (json0.showPrev === "Y" && json0.prevScreenID !== null) {
            CreateButton("btnPrev_" + wizardScreenID, "javascript:ShowPrevQuestion(" + json0.prevScreenID + "," + wizardScreenID + ")", "Prev");
        }
        if (json0.showNext === "Y" && json0.nextScreenID !== null) {
            CreateButton("btnNext_" + wizardScreenID, "javascript:ShowNextQuestion(" + json0.nextScreenID + "," + wizardScreenID + ")", "Next");
        }

        function CreateButton(id, callback, text) {
            let button = document.createElement("button");
            button.setAttribute("onclick", callback);
            button.setAttribute("id", id);
            button.textContent = text;
            document.getElementById("frm_" + wizardScreenID).appendChild(button);
        }
    }
}

function AdvanceOnClick(opt) {
    if (opt === "Y") {

    }
}

function ShowNextQuestion(id, wizardScreenID) {
    let json2 = EUIData.jSon2.filter(i => i.wizardQuestionID === id)[0];
    document.getElementById("frm_" + wizardScreenID).hidden = true;
    BuildAndBindUI(json2.wizardScreenID);
}

// }());
