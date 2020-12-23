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
    url: "sample-json/json.json",
    title: "Data Orang",
    thead: ["ID", "Name", "Grade", "Passing", "Sex", "Birth", "Place"]
});

var json_table = 
[
    { "id" : 1, "name" : "Name number 1", "grade" : 70, "passing" : 1, "sex" : "Female", "birth" : "2020-04-18", "place" : "Kedungwuni"},
    { "id" : 2, "name" : "Name number 2", "grade" : 10, "passing" : 0, "sex" : "Male", "birth" : "2020-04-17", "place" : "Linggo Asri"},
    { "id" : 3, "name" : "Name number 3", "grade" : 80, "passing" : 1, "sex" : "Female", "birth" : "2020-04-16", "place" : "Bojong"},
    { "id" : 4, "name" : "Name number 4", "grade" : 30, "passing" : 0, "sex" : "Male", "birth" : "2020-04-15", "place" : "Bojong"},
    { "id" : 5, "name" : "Name number 5", "grade" : 100, "passing" : 1, "sex" : "Female", "birth" : "2020-04-14", "place" : "Kedungwuni"},
    { "id" : 6, "name" : "Name number 6", "grade" : 30, "passing" : 0, "sex" : "Male", "birth" : "2020-04-13", "place" : "Kajen"},
    { "id" : 7, "name" : "Name number 7", "grade" : 100, "passing" : 1, "sex" : "Female", "birth" : "2020-04-12", "place" : "Kedungwuni"},
    { "id" : 8, "name" : "Name number 8", "grade" : 80, "passing" : 1, "sex" : "Male", "birth" : "2020-04-11", "place" : "Bojong"},
    { "id" : 9, "name" : "Name number 9", "grade" : 10, "passing" : 0, "sex" : "Female", "birth" : "2020-04-10", "place" : "Kajen"},
    { "id" : 10, "name" : "Name number 10", "grade" : 20, "passing" : 0, "sex" : "Male", "birth" : "2020-04-09", "place" : "Bojong"},
    { "id" : 11, "name" : "Name number 11", "grade" : 50, "passing" : 0, "sex" : "Male", "birth" : "2020-04-09", "place" : "Pekajangan"},
    { "id" : 12, "name" : "Name number 12", "grade" : 60, "passing" : 0, "sex" : "Male", "birth" : "2020-04-09", "place" : "Wiradesa"}
];

arTable.init(".set-table-json", {
    data: json_table,
    title: "Data Orang",
    thead: ["ID", "Name", "Grade", "Passing", "Sex", "Birth", "Place"]
});

// arTable.init(".table2", {
//     url: "sample-json/json.json",
//     title: "Data Orang",
//     thead: ["ID", "Name", "Grade", "Passing", "Sex", "Birth", "Place"]
// });

arTable.init("#update_row", {
    url: "sample-json/json.json",
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
    url: "sample-json/json.json",
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
            listener: function(data, event, element) {
                event.preventDefault();
                var url = element.getAttribute("href");
                arTable.req(url, function(result) {
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
    url: "sample-json/json.json",
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
            listener: function(data, event, element) {
                event.preventDefault();
                var url = element.getAttribute("href");
                arTable.req(url, function(result) {
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
    url: "sample-json/json.json",
    title: "Data Orang",
    checkable: true,
    thead: ["ID", "Name", "Grade", "Passing", "Sex", "Birth", "Place"],
    content_bottom: {
        action: [{
                text: "Insert Content Bottom",
                type: "success",
                href: "insert.php",
                attr: 'id="add-data"',
                params: function(datas) {
                    var param = new Array();
                    var url = "#";
                    if (datas.length > 0) {
                        for (var i = 0; i < datas.length; i++) {
                            var ini = datas[i],
                                data = ini.data[0],
                                key  = ini.key; // get 'id'
                            param.push(data);
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
                listener: function(datas, event, element) {
                    event.preventDefault();
                    var param = new Array();
                    //custom your link/href (get current selected data)
                    if (datas.length > 0) {
                        for (var i = 0; i < datas.length; i++) {
                            var ini = datas[i],
                                data = ini.data[0],
                                key  = ini.key; // get 'id'
                            param.push(data);
                        }
                        var url = this.href + "?id=" + param.join(",");
                        arTable.req(url, function(result) {
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
                params: function(datas) {
                    var param = new Array();
                    var url = "#";
                    if (datas.length > 0) {
                        for (var i = 0; i < datas.length; i++) {
                            var ini = datas[i],
                                data = ini.data[0],
                                key  = ini.key; // get 'id'
                            param.push(data);
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
                listener: function(data, event, element) {
                    event.preventDefault();
                    var param = new Array();
                    //custom your link/href (get current selected data)
                    if (datas.length > 0) {
                        for (var i = 0; i < datas.length; i++) {
                            var ini = datas[i],
                                data = ini.data[0],
                                key  = ini.key; // get 'id'
                            param.push(data);
                        }
                        var url = this.href + "?id=" + param.join(",");
                        arTable.req(url, function(result) {
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
    url: "sample-json/json.json",
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
            },
            { 
                text    : "Grade",
                type    : "input", 
                for_key : 2, 
                attr    : 'placeholder="Cari Nilai ..."',
                filter_type : "gte"
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
            },
            { 
                text    : "Grade",
                type    : "input", 
                for_key : 2, 
                attr    : 'placeholder="Cari Nilai ..."',
                filter_type : "gte"
            }
        ]
    }
});

var setArTable = arTable.init("#table-insert", {
    url: "sample-json/json.json",
    title: "Data Orang",
    thead: ["ID", "Name", "Grade", "Passing", "Sex", "Birth", "Place"],action: [{
        text: "Delete",
        cls: "btn t1 red",
        href: "sample-json/delete.json",
        listener: function(data, event, element) 
        {
            event.preventDefault();
            var url = element.getAttribute("href");
            arTable.req(url, function(res) {
                if (res.error === null && arTable.isJSON(res.result)) 
                {
                    var json = JSON.parse(res.result);
                    if (json.hasil) 
                    {
                        setArTable.deleteData(data.key);
                    }
                } 
                else 
                {
                    // Error
                }
            });
        }
    }],
    content_top: {
        action: [{
                text: "Insert Once",
                type: "success",
                href: "sample-json/insert.json",
                listener: function(data, event, element) {
                    event.preventDefault();
                    arTable.req(this.href, function(res) {
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
                href: "sample-json/insert-multiple.json",
                listener: function(data, event, req) {
                    event.preventDefault();
                    arTable.req(this.href, function(res) {
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
    url: "sample-json/json.json",
    title: "Data Orang",
    checkable: true,
    thead: ["ID", "Name", "Grade", "Passing", "Sex", "Birth", "Place"],
    action: [{
        text: "Edit",
        cls: "btn t1 blue",
        href: "sample-json/update.json",
        listener: function(data, event, element) {
            event.preventDefault();
            var url = element.getAttribute("href");
            arTable.req(url, function(res) {
                if (res.error === null && arTable.isJSON(res.result)) {
                    updateArTable.updateData(data.key, JSON.parse(res.result));
                } else {
                    // Error
                }
            });
        }
    },

    {
        text: "Delete",
        cls: "btn t1 red",
        href: "sample-json/delete.json",
        listener: function(data, event, element) 
        {
            event.preventDefault();
            var url = element.getAttribute("href");
            arTable.req(url, function(res) {
                if (res.error === null && arTable.isJSON(res.result)) 
                {
                    var json = JSON.parse(res.result);
                    if (json.hasil) 
                    {
                        updateArTable.deleteData(data.key);
                    }
                } 
                else 
                {
                    // Error
                }
            });
        }
    }],
    content_top: {
        action: [{
            text: "Update 2 data of Selected",
            type: "success",
            href: "sample-json/update-multiple.json",
            listener: function(data, event, element) {
                event.preventDefault();
                if (data.length > 0) {
                    arTable.req(this.href, function(res) {
                        if (res.error === null && arTable.isJSON(res.result)) {
                            var keys = new Array();
                            for(var i = 0; i < data.length; i++)
                            {
                                keys.push(data[i].key);
                            }
                            updateArTable.updateData(keys, JSON.parse(res.result));
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
    url: "sample-json/json.json",
    title: "Data Orang",
    checkable: true,
    thead: ["ID", "Name", "Grade", "Passing", "Sex", "Birth", "Place"],
    action: [{
        text: "Delete",
        cls: "btn t1 red",
        href: "sample-json/delete.json",
        listener: function(data, event, element) 
        {
            event.preventDefault();
            var url = element.getAttribute("href");
            arTable.req(url, function(res) {
                if (res.error === null && arTable.isJSON(res.result)) 
                {
                    var json = JSON.parse(res.result);
                    if (json.hasil) 
                    {
                        deleteArTable.deleteData(data.key);
                    }
                } 
                else 
                {
                    // Error
                }
            });
        }
    }],
    content_top: {
        action: [{
            text: "Delete Selected",
            type: "success",
            href: "sample-json/delete.json",
            listener: function(data, event, elements) {
                event.preventDefault();
                if (data.length > 0) {
                    arTable.req(this.href, function(res) {
                        if (res.error === null && arTable.isJSON(res.result)) {
                            var json = JSON.parse(res.result);
                            var keys = new Array();
                            for(var i = 0; i < data.length; i++)
                            {
                                keys.push(data[i].key);
                            }
                            if (json.hasil) {
                                deleteArTable.deleteData(keys);
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
    url: "sample-json/json.json",
    title: "Data Orang",
    checkable: true,
    thead: ["ID", "Name", "Grade", "Passing", "Sex", "Birth", "Place"],
    action: [{
        text: "Delete",
        cls: "btn t1 red",
        href: "sample-json/delete.json",
        listener: function(data, event, element) {
            event.preventDefault();
            var url = element.getAttribute("href");
            arTable.req(url, function(res) {
                if (res.error === null && arTable.isJSON(res.result)) {
                    var json = JSON.parse(res.result);
                    if (json.hasil) {
                        var name = data[1];
                        alertArTable.deleteData(data.key);
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
            href: "sample-json/delete.json",
            listener: function(data, event, element) {
                event.preventDefault();
                
                if (data.length > 0) {
                    arTable.req(this.href, function(res) {
                        if (res.error === null && arTable.isJSON(res.result)) {
                            var json = JSON.parse(res.result);
                            if (json.hasil) {
                                for(var i = 0; i < data.length; i++)
                                {
                                    alertArTable.deleteData(data[i].key)
                                }
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
    url     : "sample-json/json.json",
    title   : "Data Orang",
    checkable: true,
    thead   : ["ID", "Name", "Grade", "Passing", "Sex", "Birth", "Place"],
    action  : 
    [
        {
            text    : "Delete",
            cls     : "btn t1 red",
            href    : "sample-json/delete.json",
            listener: function(data, event, element) 
            {
                event.preventDefault();
                var name = data.data[1];
                confirmArTable.showConfirm({
                    type        : "danger",
                    title       : "WARNING",
                    text        : "Are you sure want to delete this data [<strong>" + name + "</strong>]?",
                    accept_text : "Ok",
                    abort_text  : "No"
                }, function () {

                    var url = element.getAttribute("href");
                    arTable.req(url, function(res) {
                        if (res.error === null && arTable.isJSON(res.result)) 
                        {
                            var json = JSON.parse(res.result);
                            if (json.hasil) {
                                confirmArTable.deleteData(data.key);
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
                href    : "sample-json/delete.json",
                listener: function(data, event, element) {
                    event.preventDefault();

                    var url = element.getAttribute("href");

                    if (data.length > 0) 
                    {
                        confirmArTable.showConfirm({
                            type        : "danger",
                            title       : "WARNING",
                            text        : "Are you sure want to delete these selected data?",
                            accept_text : "Ok",
                            abort_text  : "No"
                        }, function () {
                            
                            arTable.req(url, function(res) {
                                if (res.error === null && arTable.isJSON(res.result)) 
                                {
                                    var json = JSON.parse(res.result);
                                    if (json.hasil) {
                                        for(var i = 0; i < data.length; i++)
                                        {
                                            confirmArTable.deleteData(data[i].key)
                                        }
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
    url : "sample-json/json.json",
    title: "Data Orang",
    thead: ["ID", "name", "Grade", "Passing", "Sex", "Birth", "Place"]
});

var othersArTable = arTable.init("#table-others", {
    url : "sample-json/json.json",
    title: "Data Orang",
    thead: ["ID", "name", "Grade", "Passing", "Sex", "Birth", "Place"],
    checkable: true
});

var insertColumnArTable = arTable.init("#table-insert-column", {
    url : "sample-json/json.json",
    title: "Data Orang",
    thead: ["ID", "name", "Grade", "Passing", "Sex", "Birth", "Place"],
    checkable: true,
    insert_column: [
        {
            thead   : "Median",
            value   : function (data)
            {
                return data[2] / 2;
            },
            html : function (data)
            {
                return data[7] >= 30 ? '<span style="color:green">' + data[7] + '</span>' : '<span style="color:red">' + data[7] + '</span>';
            }
        },
        {
            html: function(data)
            {
                return data[7] >= 30 ? "More than 30" : "Less than 30";
            }
        }
    ]
});

var json_table_hide = 
[
    { "id" : 1, "name" : "Name number 1", "grade" : 70, "passing" : 1, "sex" : "Female", "birth" : "2020-04-18", "place" : "Kedungwuni"},
    { "id" : 2, "name" : "Name number 2", "grade" : 10, "passing" : 0, "sex" : "Male", "birth" : "2020-04-17", "place" : "Linggo Asri"},
    { "id" : 3, "name" : "Name number 3", "grade" : 80, "passing" : 1, "sex" : "Female", "birth" : "2020-04-16", "place" : "Bojong"},
    { "id" : 4, "name" : "Name number 4", "grade" : 30, "passing" : 0, "sex" : "Male", "birth" : "2020-04-15", "place" : "Bojong"},
    { "id" : 5, "name" : "Name number 5", "grade" : 100, "passing" : 1, "sex" : "Female", "birth" : "2020-04-14", "place" : "Kedungwuni"},
    { "id" : 6, "name" : "Name number 6", "grade" : 30, "passing" : 0, "sex" : "Male", "birth" : "2020-04-13", "place" : "Kajen"},
    { "id" : 7, "name" : "Name number 7", "grade" : 100, "passing" : 1, "sex" : "Female", "birth" : "2020-04-12", "place" : "Kedungwuni"},
    { "id" : 8, "name" : "Name number 8", "grade" : 80, "passing" : 1, "sex" : "Male", "birth" : "2020-04-11", "place" : "Bojong"},
    { "id" : 9, "name" : "Name number 9", "grade" : 10, "passing" : 0, "sex" : "Female", "birth" : "2020-04-10", "place" : "Kajen"},
    { "id" : 10, "name" : "Name number 10", "grade" : 20, "passing" : 0, "sex" : "Male", "birth" : "2020-04-09", "place" : "Bojong"},
    { "id" : 11, "name" : "Name number 11", "grade" : 50, "passing" : 0, "sex" : "Male", "birth" : "2020-04-09", "place" : "Pekajangan"},
    { "id" : 12, "name" : "Name number 12", "grade" : 60, "passing" : 0, "sex" : "Male", "birth" : "2020-04-09", "place" : "Wiradesa"}
];

arTable.init("#table-hide", {
    data: json_table_hide,
    title: "Data Orang",
    thead: ["Name", "Grade", "Passing", "Sex", "Place"],
    hide : ["id", "birth"]
});

var json_table_replace = 
[
    { "id" : 1, "name" : "Name number 1", "grade" : 70, "passing" : 1, "sex" : "Female", "birth" : "2020-04-18", "place" : "Kedungwuni"},
    { "id" : 2, "name" : "Name number 2", "grade" : 10, "passing" : 0, "sex" : "Male", "birth" : "2020-04-17", "place" : "Linggo Asri"},
    { "id" : 3, "name" : "Name number 3", "grade" : 80, "passing" : 1, "sex" : "Female", "birth" : "2020-04-16", "place" : "Bojong"},
    { "id" : 4, "name" : "Name number 4", "grade" : 30, "passing" : 0, "sex" : "Male", "birth" : "2020-04-15", "place" : "Bojong"},
    { "id" : 5, "name" : "Name number 5", "grade" : 100, "passing" : 1, "sex" : "Female", "birth" : "2020-04-14", "place" : "Kedungwuni"},
    { "id" : 6, "name" : "Name number 6", "grade" : 30, "passing" : 0, "sex" : "Male", "birth" : "2020-04-13", "place" : "Kajen"},
    { "id" : 7, "name" : "Name number 7", "grade" : 100, "passing" : 1, "sex" : "Female", "birth" : "2020-04-12", "place" : "Kedungwuni"},
    { "id" : 8, "name" : "Name number 8", "grade" : 80, "passing" : 1, "sex" : "Male", "birth" : "2020-04-11", "place" : "Bojong"},
    { "id" : 9, "name" : "Name number 9", "grade" : 10, "passing" : 0, "sex" : "Female", "birth" : "2020-04-10", "place" : "Kajen"},
    { "id" : 10, "name" : "Name number 10", "grade" : 20, "passing" : 0, "sex" : "Male", "birth" : "2020-04-09", "place" : "Bojong"},
    { "id" : 11, "name" : "Name number 11", "grade" : 50, "passing" : 0, "sex" : "Male", "birth" : "2020-04-09", "place" : "Pekajangan"},
    { "id" : 12, "name" : "Name number 12", "grade" : 60, "passing" : 0, "sex" : "Male", "birth" : "2020-04-09", "place" : "Wiradesa"}
];

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

var replaceArTable = arTable.init("#table-replace", {
    data: json_table_replace,
    title: "Data Orang",
    thead: ["Name", "Grade", "Passing", "Sex", "Place"],
    hide : ["id", "birth"]
});

setInterval( function () {
    shuffleArray(json_table_replace);
    replaceArTable.replace(json_table_replace); // <i>It will replaced every 10 seconds</i>
}, 10000);

document.getElementById("btn-insert-column").addEventListener("click", function () { 
    insertColumnArTable.insertColumn([
        {
            thead   : "Median",
            key     : "median",
            value   : function (data)
            {
                return data[7] / 2;
            },
            html : function (data)
            {
                return data[7] >= 30 ? '<span style="color:green">' + data[7] + '</span>' : '<span style="color:red">' + data[7] + '</span>';
            }
        },
        {
            key : "type",
            html: function(data)
            {
                return data[7] >= 30 ? "More than 30" : "Less than 30";
            }
        }
    ]);
});

var updateColumnArTable = arTable.init("#table-update-column", {
    url : "sample-json/json.json",
    title: "Data Orang",
    thead: ["ID", "name", "Grade", "Passing", "Sex", "Birth", "Place"]
});

document.getElementById("btn-update-column").addEventListener("click", function () { 
    updateColumnArTable.updateColumn(2, {
        value : function (data)
        {
            var grade = data[2] + 15;
            if(grade > 100) return data[2];

            return grade;
        }
    });
    updateColumnArTable.updateColumn(3, {
        value : function (data)
        {
            return data[2] >= 70 ? 1 : 0;
        },
        html : function (data)
        {
            return data[3] === 1 ? "Lulus" : "Tidak Lulus";
        }
    });
});

insertColumnArTable.on("row", function (parent, index_data, index_row) {
    var button = parent.querySelector("button");
    if(button !== null)
    {
        button.addEventListener("click", function () {
            console.log(index_data)
        })
    }
    
    
});

var onArTable = arTable.init("#table-on", {
    url : "sample-json/json.json",
    title: "Data Orang",
    thead: ["ID", "name", "Grade", "Passing", "Sex", "Birth", "Place"],
    insert_column: [
        {
            html : function (data)
            {
                return '<span>Grade : </span><input class="grade-input" value="' + data[2] + '">';
            }
        },
        {
            html: function(data)
            {
                return "<button>BUTTON</button>";
            }
        },

    ]
});
onArTable.on("complete", function () {
    console.log("Complete");
});
onArTable.on("change", function () {
    console.log("Change");
});
onArTable.on("row", function (parent, data, index_current_row) {
    var button = parent.querySelector("button");
    var input = parent.querySelector(".grade-input");
    if(button !== null)
    {
        button.addEventListener("click", function () {
            var msg = "value : " + input.value + "<br>";
                msg += "key : " + data.key + "<br>";
                msg += "data : " + data.data + "<br>";
                msg += "index current row : " + index_current_row;
            onArTable.showAlert({
                title : "INFO",
                text : msg,
                button_text: "OK"
            });
        });
    }
});

var deleteColumnArTable = arTable.init("#table-delete-column", {
    url : "sample-json/json.json",
    title: "Data Orang",
    thead: ["ID", "Name", "Grade", "Passing", "Sex", "Birth", "Place"],
});

document.getElementById("btn-delete-column").addEventListener("click", function () { 
    deleteColumnArTable.deleteColumn([0, 1]);
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
document.getElementById("next-page").addEventListener("click", function () {
    othersArTable.nextPage();
})
document.getElementById("prev-page").addEventListener("click", function () {
    othersArTable.prevPage();
})
document.getElementById("get-pages").addEventListener("click", function () {
    show_data.innerHTML = JSON.stringify(othersArTable.pages(), null, 4);
})
document.getElementById("jump-page").addEventListener("click", function () {
    var jump = document.getElementById("jump-input").value;
    othersArTable.jumpTo(jump);
});
document.getElementById("grades-input").addEventListener("input", function () {
    var value = this.value;
    othersArTable.filter(value, 2, "gte");
});

document.getElementById('input-name').addEventListener('input', function () {
    var value = this.value;
    filterArTable.filter(value, 1);
});

document.getElementById('input-grade').addEventListener('input', function () {
    var value = this.value;
    filterArTable.filter(value, 2, "gte");
});