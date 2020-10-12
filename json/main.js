var show_doc = document.getElementsByClassName("show-doc");
var choose_doc = document.getElementsByClassName("choose-doc");

function removeActiveList() {
    for (var i = 0; i < choose_doc.length; i++) {
        var ini = choose_doc[i];
        ini.classList.remove("active");
    }
}

function removeActiveDocs() {
    for (var i = 0; i < show_doc.length; i++) {
        var ini = show_doc[i];
        ini.classList.remove("active");
    }
}
for (var i = 0; i < choose_doc.length; i++) {
    var ini = choose_doc[i];
    ini.addEventListener('click', function() {
        var id = this.getAttribute("href").split("#")[1];

        removeActiveList();
        removeActiveDocs();

        this.classList.add("active");
        document.getElementById(id).classList.add("active");
    })
}

var url = window.location.href;
var urlSplit = url.split("#");
if (urlSplit.length > 1) {

    var id = urlSplit[1];

    removeActiveList();
    removeActiveDocs();

    for (var i = 0; i < choose_doc.length; i++) {
        var ini = choose_doc[i];
        if (ini.getAttribute('href') === ("#" + urlSplit[1])) ini.classList.add("active");
    }
    document.getElementById(id).classList.add("active");
}

arTable.init("#replace");

arTable.init(".set-table", {
    url: "json/json.json",
    title: "Data Orang",
    thead: ["ID", "Name", "Grade", "Passing", "Sex", "Birth", "Place"]
});

// arTable.init(".table2", {
//     url: "json/json.json",
//     title: "Data Orang",
//     thead: ["ID", "Name", "Grade", "Passing", "Sex", "Birth", "Place"]
// });

arTable.init("#update_row", {
    url: "json/json.json",
    title: "Data Orang",
    thead: ["ID", "Name", "Grade", "Passing", "Sex", "Birth", "Place"],
    update_row: {
        3: function(data) {
            var html = (data[3] !== 1) ? '<span style="color:red;">Tidak Lulus</span>' : '<span style="color:green">Lulus</span>';
            return html;
        }
    }
});

arTable.init("#table-action", {
    url: "json/json.json",
    title: "Data Orang",
    thead: ["ID", "Name", "Grade", "Passing", "Sex", "Birth", "Place"],
    action: [{
            text: "Edit",
            cls: "btn t1 blue",
            href: "edit.php",
            params: function(data) {
                var url = this.href + "?id=" + data[0];
                return url;
            },
            listener: function(data, event, index, req, element) {
                event.preventDefault();
                var url = element.getAttribute("href");
                req(url, function(result) {
                    if (result.error === null && arTable.isJSON(result.result)) {
                        // Success
                    } else {
                        // Error
                    }
                });
            }
        },
        {
            text: "Delete",
            cls: "btn t1 red",
            href: "delete.php",
            params: function(data) {
                var url = this.href + "?id=" + data[0];
                return url;
            }
        }
    ]
});

arTable.init("#table-popup", {
    url: "json/json.json",
    title: "Data Orang",
    thead: ["ID", "Name", "Grade", "Passing", "Sex", "Birth", "Place"],
    popup_action: [{
            text: "Edit",
            cls: "btn t1 blue",
            href: "edit.php",
            params: function(data) {
                var url = this.href + "?id=" + data[0];
                return url;
            },
            listener: function(data, event, index, req, element) {
                event.preventDefault();
                var url = element.getAttribute("href");
                req(url, function(result) {
                    if (result.error === null && arTable.isJSON(result.result)) {
                        // Success
                    } else {
                        // Error
                    }
                });
            }
        },
        {
            text: "Delete",
            cls: "btn t1 red",
            href: "delete.php",
            params: function(data) {
                var url = this.href + "?id=" + data[0];
                return url;
            }
        }
    ]
});

arTable.init("#table-content-action", {
    url: "json/json.json",
    title: "Data Orang",
    checkable: true,
    thead: ["ID", "Name", "Grade", "Passing", "Sex", "Birth", "Place"],
    content_bottom: {
        action: [{
                text: "Insert Content Bottom",
                type: "success",
                href: "insert.php",
                attr: 'id="add-data"',
                params: function(data) {
                    var param = new Array();
                    var url = "#";
                    if (data.length > 0) {
                        for (var i = 0; i < data.length; i++) {
                            param.push(data[i][0]); // get 'id'
                        }
                        url = "?id=" + param.join(",");
                    }
                    return url;
                }
            },
            {
                text: "Edit Content Bottom",
                type: "info",
                href: "edit.php",
                listener: function(data, event, index, req) {
                    event.preventDefault();
                    var param = new Array();
                    //custom your link/href (get current selected data)
                    if (data.length > 0) {
                        for (var i = 0; i < data.length; i++) {
                            param.push(data[i][0]);
                        }
                        var url = this.href + "?id=" + param.join(",");
                        req(url, function(result) {
                            if (result.error === null && arTable.isJSON(result.result)) {
                                // Success
                            } else {
                                // Error
                            }
                        });
                    }
                }
            }
        ]
    },
    content_top: {
        action: [{
                text: "Insert Content Top",
                type: "success",
                href: "insert.php",
                attr: 'id="add-data"',
                params: function(data) {
                    var param = new Array();
                    var url = "#";
                    if (data.length > 0) {
                        for (var i = 0; i < data.length; i++) {
                            param.push(data[i][0]); // get 'id'
                        }
                        url = "?id=" + param.join(",");
                    }
                    return url;
                }
            },
            {
                text: "Edit Content Top",
                type: "info",
                href: "edit.php",
                listener: function(data, event, index, req) {
                    event.preventDefault();
                    var param = new Array();
                    //custom your link/href (get current selected data)
                    if (data.length > 0) {
                        for (var i = 0; i < data.length; i++) {
                            param.push(data[i][0]);
                        }
                        var url = this.href + "?id=" + param.join(",");
                        req(url, function(result) {
                            if (result.error === null && arTable.isJSON(result.result)) {
                                // Success
                            } else {
                                // Error
                            }
                        });
                    }
                }
            }
        ]
    }
});

arTable.init("#table-filter", {
    url: "json/json.json",
    title: "Data Orang",
    thead: ["ID", "Name", "Grade", "Passing", "Sex", "Birth", "Place"],
    content_top: {
        form_filter: [{
                text: "Nama Siswa",
                type: "input",
                for_key: 1,
                attr: 'placeholder="Masukkan Nama ..."'
            },
            {
                text: "Kelulusan",
                type: "select",
                for_key: 3,
                arr: [
                    ["", "All"],
                    ["1", "Lulus"],
                    ["0", "Tidak Lulus"],
                ]
            }
        ]
    },
    content_bottom: {
        form_filter: [{
                text: "Nama Siswa",
                type: "input",
                for_key: 1,
                attr: 'placeholder="Masukkan Nama ..."'
            },
            {
                text: "Kelulusan",
                type: "select",
                for_key: 3,
                arr: [
                    ["", "All"],
                    ["1", "Lulus"],
                    ["0", "Tidak Lulus"],
                ]
            }
        ]
    }
});

var setArTable = arTable.init("#table-insert", {
    url: "json/json.json",
    title: "Data Orang",
    thead: ["ID", "Name", "Grade", "Passing", "Sex", "Birth", "Place"],
    content_top: {
        action: [{
                text: "Insert Once",
                type: "success",
                href: "json/insert.json",
                listener: function(data, event, index, req) {
                    event.preventDefault();
                    req(this.href, function(res) {
                        if (res.error === null && arTable.isJSON(res.result)) {
                            // it will insert : [101,"Si Cantik",70,1,"Female","2020-04-18","Kedungwuni"]
                            setArTable.insertData(JSON.parse(res.result));
                        } else {
                            // Error
                        }
                    });
                }
            },
            {
                text: "Insert Multiple",
                type: "info",
                href: "json/insert-multiple.json",
                listener: function(data, event, index, req) {
                    event.preventDefault();
                    req(this.href, function(res) {
                        if (res.error === null && arTable.isJSON(res.result)) {

                            /*
                                it will insert :[
                                    [30,"ter tamVan",60,0,"Male","2020-03-20","Pekalongan"],
                                    [31,"tamVan dan Berani",20,0,"Female","2020-03-19","Pekalongan"]
                                ]
                            */

                            setArTable.insertData(JSON.parse(res.result));
                        } else {
                            // Error
                        }
                    });
                }
            }
        ]
    }
});

var updateArTable = arTable.init("#table-update", {
    url: "json/json.json",
    title: "Data Orang",
    checkable: true,
    thead: ["ID", "Name", "Grade", "Passing", "Sex", "Birth", "Place"],
    action: [{
        text: "Edit",
        cls: "btn t1 blue",
        href: "json/update.json",
        listener: function(data, event, index, req, element) {
            event.preventDefault();
            var url = element.getAttribute("href");
            req(url, function(res) {
                if (res.error === null && arTable.isJSON(res.result)) {
                    updateArTable.updateData(index, JSON.parse(res.result));
                } else {
                    // Error
                }
            });
        }
    }],
    content_top: {
        action: [{
            text: "Update 2 data of Selected",
            type: "success",
            href: "json/update-multiple.json",
            listener: function(data, event, index, req) {
                event.preventDefault();
                if (data.length > 0) {
                    req(this.href, function(res) {
                        if (res.error === null && arTable.isJSON(res.result)) {
                            updateArTable.updateData(index, JSON.parse(res.result));
                        } else {
                            // Error
                        }
                    });
                } else {
                    alert("Please, select at least one row");
                }
            }
        }]
    }
});

var deleteArTable = arTable.init("#table-delete", {
    url: "json/json.json",
    title: "Data Orang",
    checkable: true,
    thead: ["ID", "Name", "Grade", "Passing", "Sex", "Birth", "Place"],
    action: [{
        text: "Delete",
        cls: "btn t1 red",
        href: "json/delete.json",
        listener: function(data, event, index, req, element) {
            event.preventDefault();
            var url = element.getAttribute("href");
            req(url, function(res) {
                if (res.error === null && arTable.isJSON(res.result)) {
                    var json = JSON.parse(res.result);
                    if (json.hasil) {
                        deleteArTable.deleteData(index);
                    }
                } else {
                    // Error
                }
            });
        }
    }],
    content_top: {
        action: [{
            text: "Delete Selected",
            type: "success",
            href: "json/delete.json",
            listener: function(data, event, index, req) {
                event.preventDefault();
                if (data.length > 0) {
                    req(this.href, function(res) {
                        if (res.error === null && arTable.isJSON(res.result)) {
                            var json = JSON.parse(res.result);
                            if (json.hasil) {
                                deleteArTable.deleteData(index);
                            }
                        } else {
                            // Error
                        }
                    });
                } else {
                    alert("Please, select at least one row");
                }
            }
        }]
    }
});

var alertArTable = arTable.init("#table-alert", {
    url: "json/json.json",
    title: "Data Orang",
    checkable: true,
    thead: ["ID", "Name", "Grade", "Passing", "Sex", "Birth", "Place"],
    action: [{
        text: "Delete",
        cls: "btn t1 red",
        href: "json/delete.json",
        listener: function(data, event, index, req, element) {
            event.preventDefault();
            var url = element.getAttribute("href");
            req(url, function(res) {
                if (res.error === null && arTable.isJSON(res.result)) {
                    var json = JSON.parse(res.result);
                    if (json.hasil) {
                        var name = data[1];
                        alertArTable.deleteData(index);
                        alertArTable.showAlert({
                            type: "success",
                            title: "BERHASIL",
                            text: "Successfully deleted the data : " + name,
                            button_text: "Ok"
                        });
                    }
                } else {
                    // Error
                }
            });
        }
    }],
    content_top: {
        action: [{
            text: "Delete Selected",
            type: "success",
            href: "json/delete.json",
            listener: function(data, event, index, req) {
                event.preventDefault();
                if (data.length > 0) {
                    req(this.href, function(res) {
                        if (res.error === null && arTable.isJSON(res.result)) {
                            var json = JSON.parse(res.result);
                            if (json.hasil) {
                                alertArTable.deleteData(index);
                                alertArTable.showAlert({
                                    type: "success",
                                    title: "BERHASIL",
                                    text: "Successfully deleted the data",
                                    button_text: "Ok"
                                });
                            }
                        } else {
                            // Error
                        }
                    });
                } else {
                    alertArTable.showAlert({
                        type: "danger",
                        title: "Ops",
                        text: "Please at least choose one row",
                        button_text: "Ok"
                    });
                }
            }
        }]
    }
});

var confirmArTable = arTable.init("#table-confirm", {
    url     : "json/json.json",
    title   : "Data Orang",
    checkable: true,
    thead   : ["ID", "Name", "Grade", "Passing", "Sex", "Birth", "Place"],
    action  : 
    [
        {
            text    : "Delete",
            cls     : "btn t1 red",
            href    : "json/delete.json",
            listener: function(data, event, index, req, element) 
            {
                event.preventDefault();
                var name = data[1];
                confirmArTable.showConfirm({
                    type        : "danger",
                    title       : "WARNING",
                    text        : "Are you sure want to delete this data [<strong>" + name + "</strong>]?",
                    accept_text : "Ok",
                    abort_text  : "No"
                }, function () {

                    var url = element.getAttribute("href");
                    req(url, function(res) {
                        if (res.error === null && arTable.isJSON(res.result)) 
                        {
                            var json = JSON.parse(res.result);
                            if (json.hasil) {
                                confirmArTable.deleteData(index);
                                confirmArTable.showAlert({
                                    type: "success",
                                    title: "BERHASIL",
                                    text: "Successfully deleted the data : " + name,
                                    button_text: "Ok"
                                });
                            }
                        } else {
                            // Error
                        }
                    });

                });
                
            }
        }
    ],
    content_top: 
    {
        action: 
        [
            {
                text    : "Delete Selected",
                type    : "success",
                href    : "json/delete.json",
                listener: function(data, event, index, req) {
                    event.preventDefault();
                    if (data.length > 0) 
                    {
                        confirmArTable.showConfirm({
                            type        : "danger",
                            title       : "WARNING",
                            text        : "Are you sure want to delete these selected data?",
                            accept_text : "Ok",
                            abort_text  : "No"
                        }, function () {
                            req(this.href, function(res) {
                                if (res.error === null && arTable.isJSON(res.result)) 
                                {
                                    var json = JSON.parse(res.result);
                                    if (json.hasil) {
                                        confirmArTable.deleteData(index);
                                        confirmArTable.showAlert({
                                            type: "success",
                                            title: "BERHASIL",
                                            text: "Successfully deleted the data",
                                            button_text: "Ok"
                                        });
                                    }
                                } else {
                                    // Error
                                }
                            });
        
                        });
                        
                    } else {
                        confirmArTable.showAlert({
                            type: "danger",
                            title: "Ops",
                            text: "Please at least choose one row",
                            button_text: "Ok"
                        });
                    }
                }
            }
        ]
    }
});

var filterArTable = arTable.init("#table--filter", {
    url : "json/json.json",
    title: "Data Orang",
    thead: ["ID", "name", "Grade", "Passing", "Sex", "Birth", "Place"]
});

var othersArTable = arTable.init("#table-others", {
    url : "json/json.json",
    title: "Data Orang",
    thead: ["ID", "name", "Grade", "Passing", "Sex", "Birth", "Place"],
    checkable: true
});

var show_data = document.getElementById("show-data");

document.getElementById("clear-checked").addEventListener("click", function () {
    othersArTable.clearChecked();
})
document.getElementById("get-data").addEventListener("click", function () {
    show_data.innerHTML = JSON.stringify(othersArTable.getData(), null, 4);
})
document.getElementById("get-checked").addEventListener("click", function () {
    show_data.innerHTML = JSON.stringify(othersArTable.getCheckedData(), null, 4);
})
document.getElementById("get-current").addEventListener("click", function () {
    show_data.innerHTML = JSON.stringify(othersArTable.getCurrentData(), null, 4);
})
document.getElementById("get-all-current").addEventListener("click", function () {
    show_data.innerHTML = JSON.stringify(othersArTable.getAllCurrentData(), null, 4);
})



document.getElementById('input-name').addEventListener('input', function () {
    var value = this.value;
    filterArTable.filter(value, 1);
});

document.getElementById('input-grade').addEventListener('input', function () {
    var value = this.value;
    filterArTable.filter(value, 2);
});