const _SessionKey = "LoginSession";
const _SessionOut = "SessionOut";

const _SEARCHST = "R";
const _INSERTST = "C";
const _UPDATEST = "U";
const _DELETEST = "D";

const _vrRequired = 'required';

//로그인 페이지로 이동
var gotoLogin = function () {
    window.location = "/Account/Login";
}


//입력컨트롤 Get Value
var getEditorValue = function (ctrId) {
    var ctrl = "#" + ctrId.toString().replace(/#/gi, "");
    var inputType = getEditorType(ctrl);
    return eval("$('" + ctrl + "')." + inputType + "('instance').option('value')");
}


//입력컨트롤 Set Value
var setEditorValue = function (ctrId, objValue) {

    //if (ctrl.ParseDate != undefined) {
    //    if (objValue == "") {
    //        objValue = null;
    //    }
    //    else if (objValue != "") {
    //        objValue = fnStringToDate(objValue);
    //    }
    //    ctrl.SetDate(objValue);
    //}
    //else {
    //    ctrl.SetValue(objValue);
    //}

    if (objValue == undefined || objValue == null) objValue = "";

    var ctrl = "#" + ctrId.toString().replace(/#/gi, "");
    var inputType = getEditorType(ctrl);
    return eval("$('" + ctrl + "')." + inputType + "('instance').option('value', '" + objValue + "')");

}


//입력컨트롤 disabled
var getEditorDisabled = function (ctrId, bValue = false) {
    var ctrl = "#" + ctrId.toString().replace(/#/gi, "");
    var inputType = getEditorType(ctrl);
    eval("$('" + ctrl + "')." + inputType + "({ disabled: bValue })");
}


//입력컨트롤 타입
var getEditorType = function (ctrId) {
    var classList = $(ctrId).get(0).classList;
    
    if (classList.contains('dx-selectbox')) {
        return 'dxSelectBox';
    }
    if (classList.contains('dx-numberbox')) {
        return 'dxNumberBox';
    }
    if (classList.contains('dx-checkbox')) {
        return 'dxCheckBox';
    }
    if (classList.contains('dx-datebox')) {
        return 'dxDateBox';
    }
    if (classList.contains('dx-radiogroup')) {
        return 'dxRadioGroup';
    }
    if (classList.contains('dx-dropdownbox')) {
        return 'dxDropDownBox';
    }

    return 'dxTextBox';
}


//입력컨트롤 Set Validator
var setEditorValidator = function (ctrId, vrtype, msg) {
    var ctrl = "#" + ctrId.toString().replace(/#/gi, "");

    $(ctrl).dxValidator({
        validationRules: [{ type: vrtype, message: msg }]
    });
}


//입력 컨트롤 Validation 체크
var isEditorValid = function (ctrId) {
    var ctrl = "#" + ctrId.toString().replace(/#/gi, "");
    var isValid = $(ctrl).dxValidator("instance").validate().isValid;
    if (!isValid) $(ctrl).dxValidator("instance").validate();
    return isValid;
}


//빈값 체크
var isEmpty = function (value) {

    if (value == "" || value == null || value == undefined || (value != null && typeof value == "object" && !Object.keys(value).length)) {
        return true
    } else {
        return false
    }

};


//저장할 Model 정보를 전송 할 수있는 정보 생성후 리턴
var CreateSaveElement = function (arr) {

    var frmDIv;

    arr.forEach(function (item, index, array) {

        var frmDivID = "#" + item.frmDivID.toString().replace(/#/gi, "");
        var gridIns;
        var gridDatas;
        var listId;
        var hidel;

        $("#frmKimJeongHwanDiv").remove();
        $(frmDivID).append("<div id='frmKimJeongHwanDiv' style='height: 0px; visibility: hidden;'></div>");

        $(frmDivID)
            .find('.dx-textbox,.dx-selectbox,.dx-numberbox,.dx-checkbox,.dx-datebox,.dx-radiogroup,.dx-dropdownbox')
            .map((i, el) => {
                var $el = $(el);
                var input = $el.find('input');

                if (input.attr('name') != undefined) CreateInputElement(input.attr('name'), input.val(), i, $(frmDivID)[0]);

            });

        var arrDetails = item.Details;

        if (arrDetails.length == undefined) {

            if (item.Details.gridType == "dxTreeList") {
                gridIns = $("#" + item.Details.gridId).dxTreeList("instance");
            }
            else {
                gridIns = $("#" + item.Details.gridId).dxDataGrid("instance");
            }
            
            gridDatas = gridIns.getController("data").items();
            listId = item.Details.listId;
            var idx = 0;

            //gridIns.saveEditData();

            for (const element of gridDatas) {

                if (element.rowType == "data") {

                    hidel = gridIns.getRowElement(element.rowIndex);

                    if (hidel.is(":hidden")) gridIns.cellValue(element.rowIndex, "CUDFLAG", _DELETEST);

                    var item = element.data;

                    for (var property in item) {

                        if (item.hasOwnProperty(property)) {
                            CreateInputElement(property, item[property], element.rowIndex, $(frmDivID)[0], listId);
                        }

                    }

                    idx = element.rowIndex;

                }
            }

            //tree list 인경우 삭제할 Key
            if (gridIns.NAME == "dxTreeList") {

                var arrDeletedRowsKey = gridIns.option('deletedRowsKey');

                if (arrDeletedRowsKey != undefined) {

                    arrDeletedRowsKey.forEach(function (itemT, indexT, arrayT) {

                        idx++;

                        for (var property in itemT) {

                            if (itemT.hasOwnProperty(property)) {

                                if (property == "CUDFLAG") {
                                    CreateInputElement(property, _DELETEST, idx, $(frmDivID)[0], listId);
                                }
                                else {
                                    CreateInputElement(property, itemT[property], idx, $(frmDivID)[0], listId);
                                }

                            }

                        }

                    });

                }

            }

        }
        else {

            var arrlen = arrDetails.length;

            arrDetails.forEach(function (itemD, indexD, arrayD) {
                
                if (itemD.gridType == "dxTreeList") {
                    gridIns = $("#" + itemD.gridId).dxTreeList("instance");
                }
                else {
                    gridIns = $("#" + itemD.gridId).dxDataGrid("instance");
                }
                
                gridDatas = gridIns.getController("data").items();
                listId = itemD.listId;
                var idx = 0;

                //gridIns.saveEditData();

                for (const element of gridDatas) {

                    if (element.rowType == "data") {
                        
                        hidel = gridIns.getRowElement(element.rowIndex);

                        if (hidel.is(":hidden")) gridIns.cellValue(element.rowIndex, "CUDFLAG", _DELETEST);

                        var item = element.data;

                        for (var property in item) {

                            if (item.hasOwnProperty(property)) {
                                CreateInputElement(property, item[property], element.rowIndex, $(frmDivID)[0], listId);
                            }

                        }

                        idx = element.rowIndex;

                    }
                }

                //tree list 인경우 삭제할 Key
                if (gridIns.NAME == "dxTreeList") {

                    var arrDeletedRowsKey = gridIns.option('deletedRowsKey');

                    if (arrDeletedRowsKey != undefined) {

                        arrDeletedRowsKey.forEach(function (itemT, indexT, arrayT) {

                            idx++;

                            for (var property in itemT) {

                                if (itemT.hasOwnProperty(property)) {

                                    if (property == "CUDFLAG") {
                                        CreateInputElement(property, _DELETEST, idx, $(frmDivID)[0], listId);
                                    }
                                    else {
                                        CreateInputElement(property, itemT[property], idx, $(frmDivID)[0], listId);
                                    }
                                    
                                }

                            }

                        });

                    }

                }

            });

        }

        frmDIv = $(frmDivID + " :input");   //.serialize();

    });

    $("#frmKimJeongHwanDiv").remove();

    return frmDIv;

}


//Model 정보를 전송 할 수있는 Input Element 생성
var CreateInputElement = function (itemName, itemValue, itemIndex, container, listId) {
    var $input = $("<input/>");

    container = $("#frmKimJeongHwanDiv")[0];
    
    if (listId == undefined) {
        $input.appendTo(container).attr({ type: "hidden", name: itemName }).val(itemValue);
    }
    else {
        $input.appendTo(container).attr({ type: "hidden", name: listId + "[" + itemIndex + "]." + itemName }).val(itemValue);
    }

}


//Data Grid Or Tree List Row 추가
var AddNewRow = function (grid, e) {

    if (grid.NAME == "dxTreeList") {

        if (e.row.isNewRow) {
            return;
        }

        if (TreeCheckRequired(grid, grid.option("keyExpr"))) {

            if (e == undefined || e == null) grid.addRow(null);
            else grid.addRow(e.row.key);

        }

    }
    else {
        grid.addRow();
    }
    
}


//Data Grid Or Tree List Row 제거
var DeleteRow = function (grid, e) {

    if (e.row.dataIndex != undefined) {

        if (grid.NAME == "dxTreeList") {

            if (isEmpty(e)) {
                alert("TreeList 컨트롤일 경우 element 정보가 필요합니다. DeleteRow(tree component, e) 입니다.");
                return;
            }

            if (TreeCheckRequired(grid, grid.option("keyExpr"))) {

                //삭제되는 행 키값 처리
                TreeSetDeleteKeys(grid, e.row.node);

                grid.deleteRow(e.row.rowIndex);

                grid.saveEditData();

            }

        }
        else {

            //행을 Hidden 시킴
            var el = grid.getRowElement(e.row.rowIndex);
            grid.element().find(el).hide();

        }
        
    }
    else {
        grid.deleteRow(e.row.rowIndex);
    }

}


//삭제되는 행 키값처리
var TreeSetDeleteKeys = function (Tree, items) {

    //사용자 정의 옵션 값 확인
    var arrDeletedRowsKey = Tree.option('deletedRowsKey');

    if (arrDeletedRowsKey === undefined) {
        arrDeletedRowsKey = [];
    }

    //키값 배열에 키값 Push
    arrDeletedRowsKey.push(items.data);

    //사용자 정의 옵션에 삭제되는 키값 저장
    Tree.option('deletedRowsKey', arrDeletedRowsKey);

    //하위 노드에 대해서 재귀 호출로 키값 처리
    if (items.children.length > 0) {

        var arr = items.children;

        arr.forEach(function (item, index, array) {

            //삭제되는 하위 행 키값처리
            TreeSetDeleteKeys(Tree, item);

        });
        
    }

}


//Tree List 필수 입력 체크 및 Tree 데이터 임시 저장
var TreeCheckRequired = function (tree, keyField) {

    var rowDatas = tree.getController("data").items();

    const dupChkarr = [];

    jQuery.grep(rowDatas, function (item) {
        var data;

        if (item.isNewRow) {
            data = eval("item.data." + keyField);
        } else {
            data = item.key;
        }

        return dupChkarr.push(data);
    });

    const dupChkset = new Set(dupChkarr);

    if (dupChkarr.length !== dupChkset.size) {
        parent.Common_MsgBox("트리 Node에 동일한 Key값이 존재합니다.");
        return false;
    }


    for (const rowElement of rowDatas) {

        if (rowElement.isEditing || rowElement.isNewRow) {

            var colDatas = tree.option("columns");

            for (const colElement of colDatas) {

                var vr = colElement.validationRules;

                if (vr != undefined) {

                    for (const vrType of vr) {

                        var colData = eval('rowElement.data.' + colElement.dataField).toString();

                        if (vrType.type == "required" && (colData == undefined || colData == "")) {
                            tree.editCell(rowElement.rowIndex, colElement.dataField)
                            return false;
                        }

                    }

                }

            }

        }

    }

    //트리데이터 임시저장
    tree.saveEditData();

    //tree.saveEditData().done(function () {

    //    //delRows.forEach(function (item, index, array) {
    //    //    debugger;
    //    //    var rowIdx = tree.getRowIndexByKey(item);

    //    //    //삭제된 행을 Hidden 시킴
    //    //    tree.element().find(tree.getRowElement(rowIdx)).hide();

    //    //});

    //});

    return true;
}


//Data Grid Or Tree List 데이터 로드
var LoadDataSource = function (grid, data) {
    setTimeout(function () {
        grid.option("dataSource", data);
    }, grid.cancelEditData());
}


//Data Grid Or Tree List 데이터 리로드
var ReloadDataSource = function (grid, data) {
    setTimeout(function () {
        LoadDataSource(grid, data);
    }, ClearDataSource(grid));
}


//Data Grid Or Tree List 데이터 클리어
var ClearDataSource = function (grid) {
    setTimeout(function () {
        grid.option("dataSource", []);
    }, grid.cancelEditData());
}


//Data Grid Or Tree List Header Align
var OnStdHeaderAlign = function (e, align) {
    if (e.rowType == "header") {
        e.cellElement.css("text-align", align);
    }
}


//Data Grid Or Tree List Header Align
var OnStdToolbarHide = function (e) {
    e.toolbarOptions.visible = false;
}


//Tree 모두 펼치기(true), 접기(false)
var TreeExpandAll = function (Tree, bValue) {
    Tree.option('autoExpandAll', bValue);
    Tree.refresh();
}