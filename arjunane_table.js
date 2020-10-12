(function (window) {

    "use strict";

    var global_index    = 0,
        global_data     = {};

    if (typeof Array.isArray === 'undefined') {
        Array.isArray = function(obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        }
    };
    
    var links       = document.getElementsByTagName("link"),
        isCSS_exist = false;

    if(links.length !== 0)
    {
        for(var l = 0; l < links.length; l++)
        {
            if(links[l].getAttribute("href") !== null && (links[l].getAttribute("href").indexOf("arjunane_table.min.css") !== -1 || links[l].getAttribute("href").indexOf("arjunane_table.css") !== -1)) isCSS_exist = true;
        }
    }
    
    if(!isCSS_exist)
    {
        var _path       = "";
        if(typeof document.currentScript === 'undefined')
        {
            for(var i = 0; i < document.scripts.length; i++)
            {
                if(document.scripts[i].src.indexOf("arjunane_table") !== -1) _path = document.scripts[i].src.split("/");
            }
        }
        else
        {
            _path       = document.currentScript.src.split("/");
        }
        var script      = document.createElement("link"),
            currentName = _path[_path.length -1].length,
            path        = _path.join("/").slice(0, -currentName);
            script.rel  = "stylesheet";
            script.href = path + "arjunane_table.min.css";

        document.head.appendChild(script);
    }

    var arjunane_table = function()
    {
        this.version        = "1.0.0";
        this.github         = "https://github.com/dimas-ak/";
        this.developed_by   = "Dimas Awang Kusuma";
    }
    /**
     * Object/obj
     * 
     * url                              *required
     * 
     * type         : json/array         *required
     * 
     * get_file
     * 
     */

    /**
     * 
     * @param {string} selector element
     * @param {object} obj 
     * 
     */
    arjunane_table.prototype.init = function (selector, obj)
    {
        var ar = function() { };
        ar.prototype = arjunane_table.prototype;

        var newReturn = new ar();
        newReturn.__initTable(selector, obj);
        return newReturn;
    }

    arjunane_table.prototype.__initTable = function (selector, obj)
    {
        var dt = {};
        var now = performance.now();

        this.str_selector   = "--arjunane-table-" + global_index;
        this.str_query      = ".--arjunane-table-" + global_index;
        this.json_search    = null;
        this.index          = global_index;
        this.obj            = obj;
        this.is_scrolled    = true;
        this.height         = false;

        this.accept_confirm = function () {};
        this.abort_confirm  = function () {};

        this.isCheckable    = false;
        this.isNumeric      = false;

        this.data_checked     = new Array();
        this.index_checked    = new Array();


        global_data[this.index] = 
        {
            index           : global_index,
            data            : {},
            per_page        : 10,
            current_page    : 1,
            arr_search      : {},
            arr_object      : null,
            order_by_index  : null,
            is_asc          : true,
        };

        var _query = document.querySelector(selector);

        if(_query === null) throw Error('\nSelector with name "' + selector + '" doesn`t exist');

        var isReplace = _query.tagName.toString().toLowerCase() === "table";
        
        // saat replace table dengan Arjunane Table
        if(isReplace)
        {
            global_data[this.index]["is_array"] = true;
            var query   = document.querySelector(selector);

            var _th     = query.getElementsByTagName("th");
            var _td     = query.getElementsByTagName("td");

            if(_th === null || _th.length === 0) throw Error('\nPlease, at least set your "th" element tag');

            // mempersiapkan data
            this.thead  = new Array();
            this.json   = new Array();
            this.json_search = null;

            // arr_td digunakan untuk : ["mencoba", "satu"]
            var arr_td      = new Array();
            // arr_tr_td digunakan untuk : [ ["mencoba", "satu"] , ["jos", "dua"]]
            var arr_tr_td   = new Array();

            // mendapatkan index pertama dimana array dimulai dari 0
            // semisal panjang _th ialah 4
            // maka di saat mendapatkan td, tr pertama berakhir pada index 3 (4 - 1)
            var length_th   = _th.length - 1;
            for(var i = 0; i < _th.length; i++)
            {
                this.thead.push(_th[i].innerHTML)
            }
            
            // mendapatkan data setiap td
            for(var i = 0; i < _td.length; i++)
            {
                // push data dari _td pada saat looping
                arr_td.push(_td[i].innerHTML);

                // jika i sama dengan panjang length_th
                // saat pertama kali perulangan, length_th ialah 3,
                // maka setelah melebihi 3, maka length_th akan ditambah berdasarkan panjang th
                // jadi length_th += _th.length (misal : 3 + 4 = 7)
                // jadi looping selanjutnya, jika i berakhir di index ke 7, kemudian 11, dan seterusnya
                // maka arr_tr_td akan push data dari arr_td
                // dan arr_td akan dikosongkan datanya
                if(i === length_th)
                {
                    length_th += _th.length;

                    arr_tr_td.push(arr_td);

                    arr_td = new Array();
                }
            }

            var container_replace = "container-arjunane-replace-" + global_index;
            // set data json dari arr_tr_td
            this.json = arr_tr_td;

            // append container setelah selector
            query.insertAdjacentHTML("afterend", '<div class="' + container_replace + '"></div>');

            // mendapatkan element berdasarkan container-arjunane-replace
            this.selector       = document.querySelector("." + container_replace);
            
            this._str_selector  = selector;
            // table sesuai selector akan di hidden/sembunyikan
            query.style.display = "none";
        }
        else
        {
            this.selector       = document.querySelector(selector);
            this._str_selector  = selector;
        }

        if(obj)
        {
            this.isCheckable    = obj.checkable || false;
            this.isNumeric      = obj.numeric || false;
            this.action         = obj.action;
            this.popup_action   = obj.popup_action;
            this.hide           = obj.hide;
            this.is_scrolled    = obj.scrollable || this.is_scrolled;
            this.height         = obj.height || this.height;
            this.thead          = obj.thead || this.thead;
            this.update_row     = obj.update_row;
            if(obj && !obj.url && !obj.get_file && !isReplace) throw Error('\nPlease, at least set "url" or "get_file"');

            var url = obj.url || obj.get_file;
        }
        

        this.__setTable();

        this.container = document.getElementsByClassName(this.str_selector);

        this.__setFormFilters();

        var gd      = global_data[this.index],
            self    = this;

        listenerToAlert(self, this.container[0]);

        // jika bukan replace()
        if(!isReplace)
        {
            this.req(url, function (data) {

                if(data.error === null && IsJsonString(data.result))
                {
                    appendData(self, data, JSON.parse(data.result))
                }
                else
                {
                    var msg =   "<strong>Selector</strong> : " + self._str_selector + "<br>" +
                                "<strong>URL</strong> : " + url + "<br>" +
                                "<strong>Messages</strong> : <br>" + data.result;

                    self.showAlert({
                        type    : "danger", 
                        title   : "Ops, something went wrong !",
                        text    : msg
                    });
                }
    
            });
        }
        else
        {
            var last = performance.now();

            dt["time"] = ((last - now % 60000) / 1000).toFixed(2);

            appendData(self, dt, this.json)
        }
        

        global_index++;
        return this;
    }

    // menambahkan listener ke alert dan confirm
    function listenerToAlert(self, container)
    {
        var confirm         = container.getElementsByClassName("--at-confirm-container")[0],
            alert           = container.getElementsByClassName("--at-alert-alert")[0],
            btns_alert      = alert.getElementsByTagName("button"),
            btns_confirm    = confirm.getElementsByTagName("button");
    
        // button alert "OK"
        btns_alert[0].addEventListener("click", function () {
            alert.classList.remove("aktif");
        });

        // button confirm "YES"
        btns_confirm[0].addEventListener("click", function () {
            confirm.classList.remove("aktif");
            self.accept_confirm();
        });

        // button confirm "NO"
        btns_confirm[1].addEventListener("click", function () {
            confirm.classList.remove("aktif");
            self.abort_confirm();
        });
    }

    function appendData(self, data, result)
    {
        var json = result;
        global_data[self.index]["data"] = json;
        
        var container = self.container[0];

        var is_array = Array.isArray(json[0]) ? true : false;

        global_data[self.index]["is_array"] = is_array;

        self.__normalizeData(json);

        self.__setResult(data.time);

        self.__setPagination();

        if(json.length === 0)
        {
            var length = self.thead.length;
            var innerHTML = container.getElementsByTagName("tbody")[0];
            innerHTML.innerHTML += '<tr><td style="text-align:center" colspan="' + length + '">Ops, Your Data is NULL</td></tr>';
        }
        else
        {
            self.__setTbody();

            if(self.isCheckable)
            {

                // menambahkan  listener ke checkbox container
                // dimana checkbox ini digunakan untuk membuat status checked menjadi true atau false
                // ke semua checkbox yang ada di dalam tbody
                container.getElementsByClassName("--at-checkbox-container")[0].addEventListener("click", function () {
                    var checkboxs = container.getElementsByTagName("tbody")[0].getElementsByClassName("--at-check-box");
                    
                    // jika nilai dari checked adalah true
                    if(this.checked)
                    {
                        // contoh data dari checkbox yang tercentang semua
                        /**
                         * 0 [...data...]
                         * 1 [...data...]
                         * 2 [...data...]
                         * ...
                         * 9 [...data...]
                         */
                        for(var i = 0; i < checkboxs.length; i++)
                        {
                            var tr = checkboxs[i].parentElement.parentElement;
                            var index = parseInt(checkboxs[i].value);
                            checkboxs[i].checked = true;
                            self.__addCheckData(index);
                            if(!tr.classList.contains("aktif")) tr.classList.add("aktif");
                        }
                    }
                    else
                    {
                        // menghapus data dari this.data_checked
                        // dimana index harus dimulai dari yang paling atas
                        /**
                         * 9 [...data...]
                         * 8 [...data...]
                         * 7 [...data...]
                         * ...
                         * 0 [...data...]
                         * 
                         * karena kalau pengurutan dimulai dari 0
                         * maka akan terjadi masalah di saat menghapus (splice) data index
                         * karena method splice akan mereset kembali data index array yang sudah ter-splice
                         * misal ada 10 array [0-9]
                         * dan data yang ter-splice dari index awal adalah 0
                         * maka sisa 9 array [0-8]
                         * dan data index terakhir (index terakhir ialah 9) yang akan di hapus bernilai undefined
                         * karena dari 9 array, index tertinggi ialah 8
                         * karena index setiap array telah di reset ulang
                         */
                        for(var i = (checkboxs.length - 1); i >= 0; i--)
                        {
                            var tr = checkboxs[i].parentElement.parentElement;
                            var index = parseInt(checkboxs[i].value);
                            checkboxs[i].checked = false;
                            self.__removeCheckData(index);
                            tr.classList.remove("aktif");
                        }
                    }
                });
            }

            container.addEventListener("click", function (evt) {
            })
            
            var btn_pages = container.getElementsByClassName("--at-page");
            
            // SELECT OPTION JUMP PAGINATION
            container.getElementsByClassName("--select-jump")[0].addEventListener("change", function () {
                self.__getPagination(this.value);
                    
                self.__setResult();
                self.__setPagination();
                self.__setTbody();
            });

            var th = container.getElementsByTagName("th");

            var is_action = 0;
            if(self.action) is_action += 1;
            if(self.popup_action) is_action += 1;

            var min_length = th.length - is_action;
            
            for(var i = 0; i < th.length; i++)
            {
                // hover th
                th[i].addEventListener("mouseout", function (evt) {
                    var td = container.getElementsByTagName("td");
                    if(is_action !== 0 && evt >= min_length) return;
                    
                    for(var t = 0; t < td.length; t++)
                    {
                        td[t].classList.remove("hover");
                    }
                }.bind(null, i));

                // hover th
                th[i].addEventListener("mouseover", function (evt) {

                    if(is_action && evt >= min_length) return;

                    var tr = container.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
                    for(var r = 0; r < tr.length; r++)
                    {
                        tr[r].getElementsByTagName("td")[evt].classList.add("hover");
                    }

                }.bind(null, i));
                
                // click th untuk order by
                th[i].addEventListener("click", function (evt) {

                    if(is_action !== 0 && evt >= min_length) return;
                    if(th[evt].classList.contains("--at-check")) return;
                    if(th[evt].classList.contains("--at-no")) return;

                    for(var t = 0; t < th.length; t++)
                    {
                        th[t].classList.remove("--desc");
                        th[t].classList.remove("--asc");
                    }
                    
                    var minus = 0;
                    if(self.isCheckable) minus += 1;
                    if(self.isNumeric) minus += 1;

                    var key = self.isCheckable ? evt - minus : evt;
                
                    self.__orderBy(key);
                    
                    var gd      = global_data[self.index],
                        is_asc  = gd["is_asc"];

                    var cls     = is_asc ? "--asc" : "--desc";

                    th[evt].classList.add(cls);
                    
                    self.__setResult();
                    self.__setPagination();
                    self.__setTbody();
                }.bind(null, i));
            }

            // BUTTON PREV
            btn_pages[0].addEventListener("click", function () {
                if(this.classList.contains("aktif"))
                {
                    self.__getPagination(global_data[self.index]["current_page"] - 1);
                    
                    
                    self.__setResult();
                    self.__setPagination();
                    self.__setTbody();
                }
            });

            // BUTTON NEXT
            btn_pages[1].addEventListener("click", function () {
                if(this.classList.contains("aktif"))
                {
                    self.__getPagination(global_data[self.index]["current_page"] + 1);
                    self.__setResult();
                    self.__setPagination();
                    self.__setTbody();
                }
            });

            // select option show per_page
            container.getElementsByClassName("--select-show")[0].addEventListener("change", function () {
                self.__getResultShow(this.value);
                self.__setResult();
                self.__setPagination();
                self.__setTbody();
            });
        }
    }

    /**
     * __getPagination
     * mendapatkan value halaman dari
     * -> Jumpt to
     * -> Button Next
     * -> Button Prev
     */
    arjunane_table.prototype.__getPagination = function (value)
    {
        global_data[this.index]["current_page"] = parseInt(value);
    }
    // update show (showing 1 - 10 of 100)
    // update pagination
    arjunane_table.prototype.__getResultShow = function (value)
    {
        global_data[this.index]["per_page"]     = parseInt(value);
        global_data[this.index]["current_page"] = 1;
    }

    arjunane_table.prototype.__setTable = function (_selector)
    {
        var selector = typeof _selector === 'undefined' ? this.selector : this.selector.parentElement;
        var loading_text = this.obj && this.obj.loading_text ? this.obj.loading_text : "Please wait ...";
        var html = '<div class="arjunane-table ' + this.str_selector + '">';

                // ALERT DANGER
                // CONFIRM
                html += '<div class="--at-alert-container --at-confirm-container">';
                    html += '<div class="--at-alert">';
                        html +=  '<div class="--at-alert-top">';
                            html += "<span>Info</span>"
                        html += '</div>';
                        html +=  '<div class="--at-alert-middle">';
                        html += '</div>';
                        html +=  '<div class="--at-alert-bottom">';
                            html += "<button>Yes</button>";
                            html += "<button>No</button>";
                        html += '</div>';
                    html += '</div>';
                html += '</div>';
                html += '<div class="--at-alert-container --at-alert-alert">';
                    html += '<div class="--at-alert">';
                        html +=  '<div class="--at-alert-top">';
                            html += "<span>Info</span>"
                        html += '</div>';
                        html +=  '<div class="--at-alert-middle">';
                        html += '</div>';
                        html +=  '<div class="--at-alert-bottom">';
                            html += "<button>OK</button>";
                        html += '</div>';
                    html += '</div>';
                html += '</div>';
                // ALERT DANGER

                // TOP
                html += '<div class="--at-top">';
                
                    if(this.obj && typeof this.obj.title !== 'undefined')
                    {
                        html += '<div class="--at-title">';
                            html += '<strong>' + this.obj.title + '</strong>';
                            if(typeof this.obj.sub_title !== 'undefined')html += '<span>' + this.obj.sub_title + '</span>';
                        html += '</div>';
                    }

                    if(this.obj && typeof this.obj.content_top !== 'undefined')
                    {
                        if(this.obj && typeof this.obj.content_top.form_filter !== 'undefined')
                        {
                            html += '<div class="--at-content --cf">';

                                var filters = this.obj.content_top.form_filter;

                                html += '<div class="--at-form-filter">';

                                html += '<label>Filters :</label>';

                                for(var i = 0; i < filters.length; i++)
                                {
                                    var ini     = filters[i],
                                        text    = ini.text || "",
                                        attr    = ini.attr || "";
                                    if(typeof ini.type === 'undefined') throw Error('\nPlease, set "type" for filters');

                                    html += '<div class="--at-form-input">';
                                        html += '<span>' + text + "</span>";
                                    if(ini.type === "input")
                                    {
                                        html += '<input ' + attr + ' class="--at-filter-' + i + '">';
                                    }
                                    else if(ini.type === "select")
                                    {
                                        if(typeof ini.arr === 'undefined') throw Error('\nPlease, set "arr" for "select" filters');

                                        html += '<select class="--at-filter-' + i + '" ' + attr + ">";
                                            for(var _a in ini.arr)
                                            {
                                                var a = ini.arr[_a];
                                                html += '<option value="' + a[0] + '">' + a[1] + '</option>';
                                            }
                                        html += '</select>';
                                    }

                                    html += '</div>';
                                }

                                html += '</div>';

                            html += '</div>';
                        }

                        html += '<div class="--at-content --cf --at-content-top">';
                        if(this.obj.content_top.action)
                        {
                            for(var i = 0; i < this.obj.content_top.action.length; i++)
                            {
                                var action  = this.obj.content_top.action[i],
                                    type    = action.type || "info",
                                    href    = action.href || "",
                                    attr    = action.attr || "",
                                    cls     = " " + (action.cls || type);
                                html += '<a href="' + href + '" class="--at-btn --at-btn-top-' + i + cls + '" ' + attr + '>' + action.text + '</a>';
                            }
                        }
                        html += '</div>';
                    }

                    html += '<div class="--at-content --cf">';
                        html += '<div class="--at-left">';
                            html += '<span class="--at-show"></span>';
                            html += '<select class="--select-show"><option value="">-</option></select>';
                        html += '</div>';
                        html += '<div class="--at-right">';
                            html += '<span>Jump to : </span>';
                            html += '<select class="--select-jump"><option value="">-</option></select>';
                            html += '<button class="--at-page">Prev</button>';
                            html += '<span class="--at-current-page">1</span>'
                            html += '<button class="--at-page">Next</button>';
                        html += '</div>';
                    html += '</div>';

                html += '</div>';
                // TOP
                
                var  cls_table_container = (this.obj && this.is_scrolled) ? " --scrolled" : "";

                cls_table_container += (this.obj && typeof this.height === "string") ? "" : " --max-height";
                var height          = (this.obj && typeof this.height === "string") ? ' style="height:' + this.height + '"' : "";

                // TABLE
                html += '<div class="--at-table-container' + cls_table_container + '"' + height + '>';
                    html += '<table>';
                        html += '<thead>';
                            if(!this.thead)
                            {
                                var msg = '\nPlease, set "thead" for ' + this._str_selector;
                                    msg += '\nExample thead : ["name", "surname", "option"]';
                                throw Error(msg);
                            }

                            // THEAD
                            html += '<tr>';


                            if(this.isNumeric)
                            {
                                html += '<th class="--at-no">';
                                    html += 'No.'
                                html += '</th>';
                            }

                            if(this.isCheckable)
                            {
                                html += '<th class="--at-check">';
                                    html += '<input autocomplete="off" type="checkbox" class="--at-checkbox-container">'
                                html += '</th>';
                            }

                            for(var i = 0; i < this.thead.length; i++)
                            {
                                html += '<th>' + this.thead[i] + "</th>";
                            }

                            if(this.action)
                            {
                                html += '<th></th>';
                            }
                            
                            if(this.popup_action)
                            {
                                html += '<th></th>';
                            }
                            html += '</tr>';
                            // THEAD

                        html += '</thead>';

                        html += '<tbody>';
                            html += '<tr><td colspan="' + this.thead.length + '"><div class="--at-center"><div class="--at-loading">' + loading_text + '</div></div></td></tr>';
                        html += '</tbody>';
                    html += '</table>';
                html += '</div>';
                // TABLE

                if(this.obj && this.obj.content_bottom)
                {
                    html += '<div class="--at-bottom">';

                        if(this.obj && typeof this.obj.content_bottom.form_filter !== 'undefined')
                        {
                            html += '<div class="--at-content --cf">';

                                var filters = this.obj.content_bottom.form_filter;

                                html += '<div class="--at-form-filter">';

                                html += '<label>Filters :</label>';

                                for(var i = 0; i < filters.length; i++)
                                {
                                    var ini     = filters[i],
                                        text    = ini.text || "",
                                        attr    = ini.attr || "";
                                    if(typeof ini.type === 'undefined') throw Error('\nPlease, set "type" for filters');

                                    html += '<div class="--at-form-input">';
                                        html += '<span>' + text + "</span>";
                                    if(ini.type === "input")
                                    {
                                        html += '<input ' + attr + ' class="--at-filter-' + i + '">';
                                    }
                                    else if(ini.type === "select")
                                    {
                                        if(typeof ini.arr === 'undefined') throw Error('\nPlease, set "arr" for "select" filters');

                                        html += '<select class="--at-filter-' + i + '" ' + attr + ">";
                                            for(var _a in ini.arr)
                                            {
                                                var a = ini.arr[_a];
                                                html += '<option value="' + a[0] + '">' + a[1] + '</option>';
                                            }
                                        html += '</select>';
                                    }

                                    html += '</div>';
                                }

                                html += '</div>';

                            html += '</div>';
                        }

                        html += '<div class="--at-content --cf --at-content-bottom">';
                        if(this.obj.content_bottom.action)
                        {
                            for(var i = 0; i < this.obj.content_bottom.action.length; i++)
                            {
                                var action  = this.obj.content_bottom.action[i],
                                    type    = action.type || "info",
                                    href    = action.href || "",
                                    attr    = action.attr || "",
                                    cls     = " " + (action.cls || type);
                                html += '<a href="' + href + '" class="--at-btn --at-btn-bottom-' + i + cls + '" ' + attr + '>' + action.text + '</a>';
                            }
                        }
                        html += '</div>';

                    html += '</div>';
                }

            html += '</div>';
        
        selector.innerHTML = html;


        // menambahkan listener ke action di content_top
        if(this.obj && this.obj.content_top && this.obj.content_top.action)
        {
            this.__addListenerToContentAction("top");
        }
        // menambahkan listener ke action di content_bottom
        if(this.obj && this.obj.content_bottom && this.obj.content_bottom.action)
        {
            this.__addListenerToContentAction("bottom");
        }

    }

    /**
     * 
     * @param {string} type
     * __addListenerToContentAction
     * Untuk menambahkan listener ke tombol/button pada content_top maupun content_bottom 
     */
    arjunane_table.prototype.__addListenerToContentAction = function (type)
    {

        var actions         = this.obj["content_" + type].action,
            self            = this,
            gd              = global_data[this.index],
            content_action  = document.getElementsByClassName(this.str_selector)[0].getElementsByClassName("--at-content-" + type)[0];
                
            for(var i = 0; i < actions.length; i++)
            {
                (function(i){
                    var action = actions[i];
                    // listener ke setiap --at-btn-top click
                    content_action.getElementsByClassName("--at-btn-" + type + "-" + i)[0].addEventListener("click", function (evt) {
                        var params  = new Array();
                        var start   = gd["current_page"] === 1 ? 0 : (gd["current_page"] - 1) * gd["per_page"],
                            href    = action.href || "";

                        if(self.data_checked.length !== 0)
                        {
                            for(var p = start; p < self.data_checked.length; p++)
                            {
                                // periksa terlebih dahulu apakah data_checked[p] bernilai undefined
                                // karena index nya bernilai tidak urut
                                // karena user memilih checkbox nya secara acak
                                // semisal user memilih tr > td checkbox
                                // 0 [...data...] 
                                // 2 [...data...] 
                                // 4 [...data...] 
                                // kemudian di normalisasikan melalui validasi apakah bernilai undefined?
                                // jika tidak bernilai undefined, maka akan di masukkan/push ke variable params
                                if(typeof self.data_checked[p] !== 'undefined')params.push(self.__setParameters(self.data_checked[p]));
                            }
                        }
                        var url = typeof action.params !== 'undefined' ? href + action.params(params) : href; 
                        // jika listener ada
                        if(typeof action.listener === 'function') action.listener(params, evt, self.index_checked, self.req);
                        // jika tidak langsung di alihkan ke halaman sesuai params atau href
                        else
                        { 
                            evt.preventDefault();
                            window.location.href = url;
                        }
                    });
                })(i);
                
            }
    }

    /**
     * __setTbody()
     * digunakan untuk menambahkan dom HTML ke Tbody
     */
    arjunane_table.prototype.__setTbody = function ()
    {
        // reset data checkable and index for checkable
        this.data_checked = new Array();
        this.index_checked = new Array();
        if(this.isCheckable)
        {
            this.container[0].getElementsByClassName("--at-checkbox-container")[0].checked = false;
        }

        var gd          = global_data[this.index],
            datas       = this.json_search === null ? this.json : this.json_search,
            is_array    = gd["is_array"],
            html        = "",
            start       = gd["current_page"] === 1 ? 0 : (gd["current_page"] - 1) * gd["per_page"],
            tbody       = this.container[0].getElementsByTagName("tbody")[0];
        
        // tmp_json digunakan menyimpan data array json
        // dimana tmp_json ini digunakan untuk __setParameters setiap klik action
        var tmp_json    = new Array();

        for(var i = start; i < datas.length; i++)
        {
            var data = datas[i];

            if(typeof data === 'undefined') continue;

            var loop = 0;

            tmp_json.push(data);

            html += '<tr>';

            if(this.isNumeric)
            {
                html += '<td class="--at-no">';
                    html += '<span>' + (i + 1) + '</span>';
                html += '</td>';
            }

            if(this.isCheckable)
            {
                html += '<td>';
                    html += '<input autocomplete="off" type="checkbox" class="--at-check-box" value="' + i + '">';
                html += '</td>';
            }

            for(var json in data)
            {

                if(this.__isHide(json) || ((parseInt(json) + 1) === data.length || json === "primary_index") )
                {
                    // jika action (untuk menambahkan aksi) ada dan looping i tidak sama dengan 0 (awal looping)
                    if(this.action && loop !== 0)
                    {
                        html += '<td class="--act">';
                        for(var a = 0; a < this.action.length;a++)
                        {
                            var act         = this.action[a],
                                btn_text    = act.text || "Action",
                                attr        = act.attr || "",
                                href        = act.href || "",
                                params      = typeof act.params !== 'undefined' ? act.params(this.__setParameters(data)) : href,
                                cls         = act.cls ? " " + act.cls : "";
                                
                            html += '<a href="' + params + '" class="--at-btn-action-tr --at-btn-action-' + a + cls + '" ' + attr + ' value="' + i + '">' + btn_text + '</a>';
                        }

                        html += '</td>';
                    }

                    if(this.popup_action && loop !== 0)
                    {
                        html += '<td class="--act">';
                            html += '<div class="--at-action --at-popup-action">';
                                html += '<span></span>';
                            html += '</div>';

                            html += '<div class="--at-action-container">';
                        for(var a = 0; a < this.popup_action.length;a++)
                        {
                            var act         = this.popup_action[a],
                                btn_text    = act.text || "Action",
                                attr        = act.attr || "",
                                href        = act.href || "",
                                params      = typeof act.params !== 'undefined' ? act.params(this.__setParameters(data)) : href,
                                cls         = act.cls ? " " + act.cls : " --default";
                            html += '<a href="' + params + '" class="--at-btn-popup-action-' + a + cls + '" ' + attr + ' value="' + i + '">' + btn_text + '</a>';
                        }

                        html += '</div></td>';
                    }
                    continue;
                } 

                html += '<td>';
                
                if(typeof this.update_row !== 'undefined' && typeof this.update_row[json] !== 'undefined')
                {
                    var msg = '\nOps, something went wrong';
                        msg += '\nChange/Update messages for';
                        msg += '\nchange : { "' + json + '" : function }';
                        msg += '\nPlease give the return as a STRING';
                    var change = this.update_row[json](this.__setParameters(data));
                    
                    if(typeof change !== 'string') throw Error(msg);

                    html += change;
                }
                else
                {
                    html += data[json];
                }

                html += '</td>';
                
                loop++;
            }

            html += '</tr>';

            /**
             * semisal current_page (halaman saat ini) ialah 1
             * dan per_page (per halaman) ialah 10
             * maka 1 * 10 = 10
             * 
             * jika i + 1 sama dengan 10 : berhenti
             */
            if((gd["current_page"] * gd["per_page"]) === (i + 1)) break;
        }
        
        tbody.innerHTML = html;
        
        var _self = this;

        // menambahkan click listener ke action
        if(this.action)
        {
            var container   = this.container[0],
                tbody       = container.getElementsByTagName("tbody")[0];

            for(var i = 0; i < tmp_json.length; i++)
            {
                var tr = tbody.getElementsByTagName("tr")[i];
                // menambahkan listener ke setiap action button
                for(var t = 0; t < this.action.length; t++)
                {
                    var act     = this.action;
                    (function (i, t){
                        tr.getElementsByClassName("--at-btn-action-" + t)[0].addEventListener("click", function (evt) {
                            var params = _self.__setParameters(tmp_json[i]),
                                value  = parseInt(this.getAttribute("value")); // mendapatkan nilai dari attribute value pada setiap a-href action di last-td
                            if(typeof act[t].listener !== 'undefined') return act[t].listener(params, evt, value, _self.req, this);
                        });
                    })(i, t);
                }
            }
        }

        // menambahhkan click listener ke popup_action
        if(this.popup_action)
        {
            var container   = this.container[0];
            var btn_act     = container.getElementsByClassName("--at-popup-action"),
                tbody       = container.getElementsByTagName("tbody")[0];
                
            for(var i = 0; i < tmp_json.length; i++)
            {
                var tr = tbody.getElementsByTagName("tr")[i];

                // menambahkan listener ke titik 3 (vertical)
                // untuk membuka container action
                btn_act[i].addEventListener("click", function () {
                    var act_container = container.getElementsByClassName("--at-action-container");
                    var next = this.nextSibling;

                    // console.log(max.getBoundingClientRect())
                    // console.log(pos)
                    if(next.classList.contains("aktif")) 
                    {
                        next.classList.remove("aktif");
                        this.classList.remove("aktif");
                        return;
                    }
                    for(var a = 0; a < act_container.length; a++)
                    {
                        btn_act[a].classList.remove("aktif");
                        act_container[a].classList.remove("aktif");
                    }
                    next.classList.add("aktif");
                    this.classList.add("aktif");
                    
                });
                
                // menambahkan listener ke setiap popup action button
                for(var t = 0; t < this.popup_action.length; t++)
                {
                    var act     = this.popup_action;

                    (function (i, t){
                        tr.getElementsByClassName("--at-btn-popup-action-" + t)[0].addEventListener("click", function (evt) {
                            var params = _self.__setParameters(tmp_json[i]),
                                value  = parseInt(this.getAttribute("value")); // mendapatkan nilai dari attribute value pada setiap a-href action di last-td
                            if(typeof act[t].listener !== 'undefined') return act[t].listener(params, evt, value, _self.req, this);
                        });
                    })(i, t);
                }
            }

        }

        // jika isCheckable bernilai true
        if(this.isCheckable)
        {
            var checkboxs   = this.container[0].getElementsByTagName("tbody")[0].getElementsByClassName("--at-check-box");
            var _self       = this;
            for(var i = 0; i < tmp_json.length; i++)
            {
                // menambahkan listener ke setiap checkbox pada tbody > tr > td input-checkbox
                checkboxs[i].addEventListener("click", function () {
                    var index   = parseInt(this.value),
                        tr      = this.parentElement.parentElement;
                    if(this.checked)
                    {
                        tr.classList.add("aktif");
                        _self.__addCheckData(index);
                    }
                    else
                    {
                        tr.classList.remove("aktif");
                        _self.__removeCheckData(index);
                    }
                });
            }
        }
    }

    /**
     * __addCheckData()
     * menambahkan data dan index checkable
     */ 
    arjunane_table.prototype.__addCheckData = function (index)
    {
        var json = this.json_search === null ? this.json : this.json_search;
        this.data_checked[index] = json[index];
        this.index_checked[index]=index;
    }

    /**
     * __removeCheckData()
     * menghapus data dan index checkable
     */ 
    arjunane_table.prototype.__removeCheckData = function (index)
    {
       this.data_checked.splice(index, 1);
       this.index_checked.splice(index, 1);
    }

    /**
     * __setFormFilters()
     * untuk menambahkan listener ke input atau select option
     */
    arjunane_table.prototype.__setFormFilters = function ()
    {
        if(this.obj && this.obj.content_top && typeof this.obj.content_top.form_filter !== 'undefined')
        {
            var _self       = this;
            setTimeout(function () {
                var container   = _self.container[0];
                var at_top      = container.getElementsByClassName("--at-top")[0];
                var form_filter = _self.obj.content_top.form_filter;
                for(var i = 0; i < form_filter.length; i++)
                {
                    (function (i) {
                        var ini         = form_filter[i];
                        var input       = at_top.getElementsByClassName("--at-filter-" + i)[0];
                        var listener    = null;
                        if(input.nodeName.toLowerCase() === "input")        listener = "keyup";
                        else if(input.nodeName.toLowerCase() === "select")  listener = "change";

                        var timeout;
                        // menambahkan listener ke input atau select option
                        // yang digunakan untuk form filter Arjunane Table
                        input.addEventListener(listener, function () {
                            var value = this.value;

                            clearTimeout(timeout);
                            // data akan di eksekusi setelah setengah detik
                            timeout = setTimeout(function () {
                                _self.filter(value, ini.for_key, ini.filter);
                            }, 500);
                        });
                    })(i);
                   
                }
            }, 1000);
        }

        if(this.obj && this.obj.content_bottom && typeof this.obj.content_bottom.form_filter !== 'undefined')
        {
            var _self       = this;
            setTimeout(function () {
                var container   = _self.container[0];
                var at_top      = container.getElementsByClassName("--at-bottom")[0];
                var form_filter = _self.obj.content_bottom.form_filter;
                for(var i = 0; i < form_filter.length; i++)
                {
                    (function (i) {
                        var ini         = form_filter[i];
                        var input       = at_top.getElementsByClassName("--at-filter-" + i)[0];
                        var listener    = null;
                        if(input.nodeName.toLowerCase() === "input")        listener = "keyup";
                        else if(input.nodeName.toLowerCase() === "select")  listener = "change";

                        var timeout;
                        // menambahkan listener ke input atau select option
                        // yang digunakan untuk form filter Arjunane Table
                        input.addEventListener(listener, function () {
                            var value = this.value;

                            clearTimeout(timeout);
                            // data akan di eksekusi setelah setengah detik
                            timeout = setTimeout(function () {
                                _self.filter(value, ini.for_key, ini.filter);
                            }, 500);
                        });
                    })(i);
                   
                }
            }, 1000);
        }
    }

    /**
     * filter()
     * digunakan untuk memfilter input atau select option
     */

    arjunane_table.prototype.filter = function (_value, _for, _filter)
    {
        global_data[this.index]["current_page"] = 1;
        /**
         * _filter masih dipertimbangkan
         */
        // jika json tidak ada atau panjang json === 0 maka dikembalikan
        if(typeof this.json.length === 'undefined' || this.json.length === 0) return;

        var filter      = "indexOf";
        var gd          = global_data[this.index];
        var tmp_json    = new Array();

        if(typeof _filter !== 'undefined') filter = _filter;

        var index = gd["is_array"] ? parseInt(_for) : _for;

        var value = _value.length === 0 ? null : _value;

        if(typeof gd["arr_search"][index] === 'undefined') throw Error('\nUndefined index or key for : ' + index);


        // jika _for tidak sama dengan * (semua index)
        if(_for !== "*") gd["arr_search"][index] = value;
        
        // length_value digunakan untuk menge-check setiap pilihan pada inputan
        // misal value input _for (untuk) index 3
        // dimana index 3 ialah nama orang
        // dan kemudian select option _for (untuk) index 4
        // dimana index 4 ialah lulus atau tidak (0 atau 1)
        /**
         * contoh isi arr_search dalam bentuk array
         * arr_search : {
         *      0 : null,
         *      1 : null,
         *      2 : null,
         *      3 : "Bejo",
         *      4 : "1"
         * }
         * 
         * jadi length_value bernilai 2 (data yang harus dicari)
         * dimana harus ada 2 kesesuaian data antara index ke 3 dan 4
         * dimana index ke 3 harus ada "Bejo" dan index ke 4 harus ada "1"
         */
        var arr_search      = gd["arr_search"],
            length_value    = 0;
        for(var i in gd["arr_search"])
        {
            if(gd["arr_search"][i] !== null) length_value += 1;
        }

        for(var i = 0; i < this.json.length; i++)
        {
            var data    = this.json[i];
            var isFound = 0;
            // mencari semua data
            if(_for === "*")
            {
                if(value === null) break;

                for(var key in data)
                {
                    if(value !== null && data[key].toString().indexOf(value) !== -1) tmp_json.push(data);
                }
            }
            else
            {
                for(var key in arr_search)
                {
                    // jika arr_search sesuai key tidak null
                    // dimana jika null berarti tidak ada yang perlu di cari
                    if(arr_search[key] !== null && data[key].toString().indexOf(arr_search[key]) !== -1) isFound += 1;
                }

                // apakah pencarian isFound sama dengan panjang/count dari length_value
                if(isFound === length_value) tmp_json.push(data);
            }
        }

        // jika _for berupa *
        // dan value yang di input kan kosong
        // maka akan menampilkan semua data
        if(value === null && _for === "*" && tmp_json.length === 0) tmp_json = this.json;

        this.json_search = tmp_json;

        this.__removeOrderByTH();
        this.__setPagination();
        this.__setResult(null);
        this.__setTbody()
    }

    arjunane_table.prototype.__removeOrderByTH = function ()
    {
        var th = this.container[0].getElementsByTagName("th");
        for(var i = 0; i < th.length; i++)
        {
            th[i].classList.remove("--asc");
            th[i].classList.remove("--desc");
        }
    }

    /**
     * __setResult()
     * 
     * digunakan untuk menampilkan jumlah awal sampai akhir dari sekian total data (showing 1 to 10 of 100)
     * 
     * _time jika pertama kali mendapatkan data, maka waktu proses mendapatkan data di tampilkan
     * 
     * show_result = span untuk menampilkan jumlah awal sampai akhir dari sekian total data
     * 
     * select_per_page = select option untuk menampilkan berapa jumlah data yang akan ditampilkan : [10, 25, 50, 100, 250, 500]
     */
    arjunane_table.prototype.__setResult = function (_time)
    {
        var gd              = global_data[this.index],
            total           = this.json_search === null ? this.json.length : this.json_search.length,
            container       = this.container[0],
            show_result     = container.getElementsByClassName("--at-show")[0],
            per_pages       = [10,25,50,100,250,500],
            select_per_page = container.getElementsByClassName("--select-show")[0];

        var time = typeof _time !== 'undefined' && _time !== null ? "(Results took " + _time + " seconds)" : "";
        
        if(total === 0)
        {
            select_per_page.innerHTML = '<option value="">-</option>';
            show_result.innerHTML = "Showing 1 to 0 of 0 " + time; 
            return;
        }
        
        var html = "",
            per  = 0;
            
        if(typeof _time !== 'undefined')
        {
            for(var i = 0; i < per_pages.length; i++)
            {
                if(total < per_pages[i]) break;
                html += '<option value="' + per_pages[i] + '">' + per_pages[i] + "</option>";
                per++;
            }
            if(per === 0) html = '<option value="">-</option>';
    
            select_per_page.innerHTML = html;
        }

        /**
         * start
         * -> jika halaman saat ini masih 1, maka data awal ialah 1
         * -> jika tidak maka halaman yang di pilih dikalikan jumlah data yang di tampilan (per_page)
         * -> misal halaman kedua, maka halaman kedua dikurangi 1 dan dikalikan jumlah per_page (misal per_page : 10) dan ditambah 1, maka start : 11
         */
        var start   = gd["current_page"] === 1 ? 1 : (gd["current_page"] - 1) * gd["per_page"] + 1,
            end     = 0;

        var calc = total - (start + gd["per_page"]);
        
        /**
         * calc
         * -> digunakan untuk menghitung apakah hasil kalkulasi bernilai negatif
         * 
         * end
         * -> jika total data yang dapat ditampilkan kurang dari total per_page
         * -> misal data hasil request (https) atau hasil pencarian berjumlah 5 dan misal per_page ialah 10, maka var end yaitu 5
         * 
         * -> jika hasil kalkulasi bernilai 0, dimana kalkulasi ini menghitung : total data - (start/index data awal + per_page)
         * -> maka var end akan didasarkan total
         * 
         * -> jika hasil kalkulasi bernilai negatif
         * -> misal jumlah data json ada 25, sedangkan user akan ingin menampilkan data ke halaman 3 dimana per_page ialah 10
         * -> maka halaman index awal di halaman ke-3 ialah 20, sedangkan kalkulasinya bernilai negatif karena harusnya index akhir ialah 30
         * -> tapi data json hanya 25, jadi var end bernilai total
        */
        if(total < gd["per_page"] || calc === 0 || calc < 0) end = total;

        else end = gd["current_page"] * gd["per_page"];

        show_result.innerHTML = "Showing " + start + " to " + end + " of " + total + " " + time; 
    }

    arjunane_table.prototype.__setPagination = function ()
    {
        var gd              = global_data[this.index],
            total           = this.json_search === null ? this.json.length : this.json_search.length,
            container       = this.container[0],
            btn_page        = container.getElementsByClassName("--at-page"),
            html            = "",
            span_current_page = container.getElementsByClassName("--at-current-page")[0],
            page_fixed      = (total / gd["per_page"]).toFixed(0), // membulatkan nilai hasil pembagian
            page_normal     = total / gd["per_page"], // mendapatkan hasil nilai yang belum dibulatkan
            pages           = total <= gd["per_page"] ? 0 : 
                                // jika hasil pembagian yang belum dibulatkan lebih besar dari nilai yang dibulatkan
                                // 55/25 = 2.2 dimana 55 ialah jumlah total data json dan 25 ialah per_page
                                // kalau ditambahkan toFixed(0), maka hasilnya ialah 2
                                // sedangkan 55/25 = 2 (kalau toFixed() ), masih sisa 5 data lagi

                                // dan jika hasil pembagian yang belum dibulatkan sama dengan hasil yang dibulatkan
                                // 100/25 = 4, dimana 4 merupakan bilangan bulat
                                page_normal > page_fixed ? parseInt(page_fixed) + 1 : parseInt(page_fixed),
            select          = container.getElementsByClassName("--select-jump")[0];
            
        if(pages === 0)
        {
            html = '<option value="">-</option>';
            span_current_page.innerHTML = 1;
            select.innerHTML = html;

            btn_page[0].classList.remove("aktif");
            btn_page[1].classList.remove("aktif");
        }
        else
        {
            for(var i = 0; i < pages; i++)
            {
                var ini = i + 1;
                html += '<option value="' + ini + '">' + ini + "</option>";
            }
            select.innerHTML = html;

            select.getElementsByTagName("option")[gd["current_page"] - 1].selected = 'selected=""';

            btn_page[0].classList.remove("aktif");
            btn_page[1].classList.remove("aktif");

            span_current_page.innerHTML = gd["current_page"];

            var calc = pages - gd["current_page"];
            /**
             * jika hasil kalkulasi tidak bernilai 0
             * maka button previous ditambahkan class aktif
             */
            // btn PREV
            if(calc !== pages - 1) btn_page[0].classList.add("aktif")

            /**
             * jika hasil kalkulasi tidak bernilai 0
             * maka button next ditambahkan class aktif
             */
            // btn NEXT
            if(calc !== 0) btn_page[1].classList.add("aktif");
            
        }
    }

    /**
     * __isHide()
     * digunakan untuk mengecheck apakah index atau key dari JSON di sembunyikan
     */
    arjunane_table.prototype.__isHide = function (key)
    {
        var gd      = global_data[this.index],
            is_array= gd["is_array"];
        if(typeof this.hide === 'undefined') return false;
        for(var i = 0; i < this.hide.length; i++)
        {
            if( 
                (is_array && parseInt(key) === parseInt(this.hide[i])) || 
                (!is_array && key === this.hide[i])
            ) return true;
        }
        return false;
    }

    /**
     * __setParameters(_json)
     * digunakan untuk menampilkan data sesuai index dari looping
     * yang dimana __setParameters ini akan digunakan di saat
     * __setParameters ini akan menghapus data array atau object di akhir
     * dimana index array terakhir ialah key number
     * dimana index key object terakhir ialah key number
     * change : { 1 : function (_json) { } }
     * atau
     * change : { "mencari" : function (_json) { } }
     * 
     */
    arjunane_table.prototype.__setParameters = function (_json)
    {
        var json = null;
        if(global_data[this.index]["is_array"])
        {
            json = _json.slice(0, _json.length - 1);
        }
        else
        {
            json = Object.keys(_json).map(function (key) { return _json[key]; }).slice(0, Object.keys(_json).length - 1);
        }
        return json;
    }

    /**
     * __normalizeData(_json)
     * digunakan untuk menambahkan index atau key pada array atau object
     * dimana jika json berupa Array maka akan ditambahkan data arrah terakhir dimana data terakhir ialah index array itu sendiri
     * begitupun dimana json berupa Object maka akan ditambahkan "primary_index"
     */
    arjunane_table.prototype.__normalizeData = function(_json, isDelete)
    {
        var gd          = global_data[this.index];
        var is_array    = gd["is_array"],
            arr_object  = gd["arr_object"],
            arr_search  = {};
        
        if(_json.length === 0) return this.json = _json;
        
        for(var json in _json)
        {
            if(arr_object === null)
            {
                arr_object = {};

                var js = _json[json];
                var i = 0;
                for(var j in js)
                {
                    // jika tidak ada index/key yang disembunyikan
                    if(!this.__isHide(j))
                    {
                        arr_object[i] = j; 
                        arr_search[j] = null;
                        i++;
                    }
                }
                gd["arr_search"] = arr_search;
                gd["arr_object"] = arr_object;
            }

            if(is_array)
            {
                if(typeof isDelete !== 'undefined') _json[json].pop();
                else _json[json].push(parseInt(json));
            }
            else
            {
                if(isDelete) delete _json[json]["primary_index"];
                else _json[json]["primary_index"] = parseInt(json);
            }
        }
        gd["data"] = _json;

        this.json = _json;
        return this.json;
    }

    /**
     * __orderBy
     * mengurutkan data json
     */

    arjunane_table.prototype.__orderBy = function (key)
    {
        var gd          = global_data[this.index],
            is_array    = gd["is_array"],
            arr_object  = gd["arr_object"],
            order_by_key= gd["order_by_index"],
            json        = this.json_search === null ? this.json : this.json_search,
            // method JSON stringify dan parse digunakan untuk menghindari this.json ter overwrite 
            // saat melakukan copy_json.sort();
            stringifyJson= JSON.stringify(json),
            copy_json   = JSON.parse(stringifyJson);

        // jika data dari global_data["order_by_index"] tidak sama dengan parameter "key"
        // maka global_data["is_asc"] = true
        // misal index th yang pilih 0, dan index th sebelumnya 1 atau null
        if(order_by_key !== parseInt(key)) gd["is_asc"] = true;

        var is_asc      = gd["is_asc"];

        gd["order_by_index"]    = key;
        // set ulang halaman current_page menjadi 1
        gd["current_page"]      = 1;

        gd["is_asc"]    = is_asc ? false : true;

        var ind = arr_object[key];
        copy_json.sort(function (a, b) {
            var dt_1 = (isDate(a[ind])) ? new Date(a[ind]) : a[ind],
                dt_2 = (isDate(b[ind])) ? new Date(b[ind]) : b[ind];
                
            if( ( isDate(a[ind]) && isDate(b[ind]) ) || ( isNumeric(a[ind]) && isNumeric(b[ind]) ) )
            {
                return (!is_asc) ? dt_1 - dt_2 : dt_2 - dt_1;
            }
            return (is_asc) ? a[ind].localeCompare(b[ind]) : b[ind].localeCompare(a[ind]);
        });
        
        this.json_search = copy_json;
    }


    arjunane_table.prototype.req    = function (url, callback)
    {
        var xhttp = new XMLHttpRequest(),
            start = performance.now();
        
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4) 
            {
                var end     = performance.now(),
                    time    = ((end - start % 60000) / 1000).toFixed(2);
                    
                if(this.status == 200)
                { 
                    callback({result : this.responseText, time : time, error : null});
                }
                else
                {
                    callback({result : this.responseText, time : time, error : { status : this.status, statusText : this.statusText}});
                }
            }
        };
        xhttp.onerror = function (e) 
        {
            console.log(e)
        };
        xhttp.open("GET", url, true);
        xhttp.send();
    }

    /**
     * deleteData()
     * untuk menghapus data JSON
     */
    arjunane_table.prototype.deleteData = function (_index)
    {
        if(typeof _index === 'undefined') return;

        var gd          = global_data[this.index],
            is_array    = gd["is_array"];

        var pages       = (gd["current_page"] - 1) * gd["per_page"];

        var remove_json = new Array();

        if(Array.isArray(_index) && _index.length === 0) return;

        if(!Array.isArray(_index)) remove_json[_index] = _index;
        else remove_json    =   _index;
        
        /**
         * perulangan di mulai dari index tertinggi
         * supaya tidak terjadi kesalahan saat splice/menghapus data
         * 9 : 9
         * 7 : 7
         * 5 : 5
         * 3 : 3
         * 0 : 0
         */
        for (var i = remove_json.length -1; i >= pages; i--)
        {
            var index = remove_json[i];
            if(this.json_search !== null)
            {
                var ini = this.json_search[index];
                if(typeof ini !== 'undefined')
                {
                    // mengambil index dari array terakhir
                    // dimana array terakhir ialah primary index atau index key
                    // untuk this.json
                    index = is_array ? ini[ini.length - 1] : ini["primary_index"];
                    this.json_search.splice(i, 1);
                }
            }
            var ini = this.json[index];
            if(typeof ini !== 'undefined') 
            {
                this.json.splice(index, 1);
            }
        }

        this.__setResult();
        this.__setTbody();
        this.__setPagination();

    }

    /**
     * __addColumn
     * digunakan untuk menambah column baru
     */
    arjunane_table.prototype.addColumn = function (columns)
    {

        var json        = this.json,
            json_search = this.json_search,
            container   = this.container[0];
        console.log(json)
        if(columns && typeof columns.length !== 'undefined')
        {
            if(json.length > 0)
            {
                for(var i = 0; i < json.length; i++)
                {
                    
                }
            }

            if(json_search.length !== null)
            {
                for(var i = 0; i < json_search.length; i++)
                {
                    
                }
            }
        }
    }

    /**
     * insertData
     * untuk menambahkan data json
     */
    arjunane_table.prototype.insertData = function (_arr)
    {
        if(typeof _arr === 'undefined') return;
        
        var gd      = global_data[this.index],
            is_array= gd["is_array"],
            per_page= gd["per_page"];

        var data = new Array();
        
        // jika bukan array (berupa object)
        // misal data _arr ialah
        // { name : "Caridi", grade : 80, class : "XI"}
        if(!Array.isArray(_arr)) 
        {
            data[0] = _arr;
        }
        else
        { 
            // jika panjang array 0
            // maka hentikan proses insertData
            if(_arr.length === 0) return;

            data = _arr;
            
            // jika bukan array
            // contoh :
            // _arr : ["Sudrun", "X", 90, "Pekalongan"]
            // jika _arr[0] = "Sudrun" || bukan array
            // dan default is_array (global_data) ialah array bukan object
            if(!Array.isArray(data[0]) && is_array)
            { 
                // reset isi dari variable data
                data = new Array();
                data[0] = _arr;
                // jadi variable data berisi
                // data = [ 0 : ["Sudrun", "X", 90, "Pekalongan"] ];
                // karena kalau tidak di normalize,
                // akan terjadi kesalahan saat looping data
                // jadi jika tidak di normalize, yang ter looping ialah
                // "Sudrun", "X", 90, "Pekalongan" (; i < data.length;)
                // jadi variable index i ialah "Sudrun" sampai "Pekalongan"
                // bukan i = ["Sudrun", "X", 90, "Pekalongan"]
            }
        }

        var new_data        = new Array(),
            new_data_search = new Array();
            
        for(var i = 0; i < data.length; i++)
        {
            var dt      = data[i];
            var length  = is_array ? this.json.length : Object.keys(this.json).length;

            // menerapkan primary_index atau key di akhir array/index
            is_array ? dt.push(this.json.length) : dt["primary_index"] = length;

            if(this.json_search !== null) 
            {
                new_data_search.push(dt);
            }

            new_data.push(dt);
        }
        
        if(this.json_search !== null) this.json_search = new_data_search.concat(this.json_search);
        this.json = new_data.concat(this.json);

        this.__setResult(null);
        this.__setPagination();
        this.__setTbody();
    }

    /**
     * updateData
     * untuk mengupdate data json
     */
    arjunane_table.prototype.updateData = function (key, arr)
    {
        if(typeof key === 'undefined' || typeof arr === 'undefined') return;
        if(Array.isArray(key) && key.length === 0) return;

        var gd          = global_data[this.index],
            is_array    = gd["is_array"],
            arr_object  = gd['arr_object'];

        var pages       = (gd["current_page"] - 1) * gd["per_page"] ;

        var update_json = new Array();
        var tbody       = this.container[0].getElementsByTagName("tbody")[0],
            tr          = tbody.getElementsByTagName("tr");

        if(!Array.isArray(key)) update_json[0] = key;
        else update_json = key;
        
        var find = new Array();
        
        var after_th = 0;
        // jika isCheckable bernilai true
        // input checkbox
        if(this.isCheckable) after_th += 1;
        // jika isNumeric bernilai true
        // pengurutan nomor
        if(this.isNumeric) after_th += 1;

        var index_find = 0;

        // pengurutan dari update_json ialah
        /**
         * misal data array
         * 0 : 0
         * 2 : 2
         * 3 : 3
         * 5 : 5
         * 7 : 7
         */
        for(var i = 0; i < update_json.length; i++)
        {
            var k       = update_json[i];
            // jadi jika k dimana update_json[ 1 ]
            // maka akan bertype undefined
            // karena array terdiri dari 0, 2, 3, 5, 7
            if(typeof k === 'undefined') continue;

            // jika arr.length bernilai undefined
            // berarti arr = { 0 : "Asiyap", 2 : "Sudrun" }
            // atau arr = { "name" : "Sudrun", "grade" : 80 }
            if(typeof arr.length === 'undefined') find = arr;
            // jika length dari arr tidak bernilai undefined 
            // dan anak dari arr[0] tidak memiliki panjang (length) atau bernilai undefined
            // maka variable find = arr
            // arr = [ 101, "Arjunane"]
            else if(typeof arr.length !== 'undefined' && typeof arr[0].length === 'undefined') find = arr;
            /**
             * jika arr[index_find] tidak bernilai undefined
             * arr = [
             *  [ "Asiyap", "Sudrun"],
             *  [ "Gendeng", "Sakrim"]
             * ]
             * atau arr = 
             * [
             *    { "name" : "sudrun", "grade" : 80}
             *    { "name" : "kempung", "grade" : 90}
             * ]
             * 
             * contoh di atas dimana object array memiliki panjang 2
             * jadi index untuk setiap object array di atas ialah 0 dan 1
             * misal data key bernilai array dan panjang nya lebih dari 2
             * maka index ke 3, 5, 7 akan ke replace arr[index_find / 1] atau [ "Gendeng", "Sakrim"] atau { "name" : "kempung", "grade" : 90}
             */
            else if(typeof arr[index_find] !== 'undefined') find = arr[index_find];

            // nilai index disamakan dengan variable k
            // dimana jika user belum menyortir atau filter data
            // singkatnya, jika this.json_search bernilai null
            var index   = k;

            // k - pages
            // jika k mempunyai nilai 2
            // dan pages bernilai 0
            // maka index tr ialah ke 2
            // atau jika k mempunyai nilai 22
            // dan hasil perkalian dari pages ((current_page - 1) * per_page || (halaman ke 3 - 1) * 10 per page) = 20
            // jadi 22 - 20 = 2
            // maka index tr yang akan di update ialah 2
            var td      = tr[k - pages].getElementsByTagName("td");
            
            for(var j in find)
            {
                // validasi apakah index array atau object ada 
                // misal nilai dari j ialah "is_done"
                // tapi di arr_object adanya cuma "name", "grade", "class", "is_passing"
                // atau jika nilai dari j sebelumnya di hide/sembunyikan
                // misal index key yang disembunyikan ialah "id"
                // dan nilai j ialah "id"
                // maka langsung di alihkan ke throw Error
                
                // atau kalau nilai j ialah 5
                // sedangkan data array dari arr_object ialah 0,1,2,3,4
                // atau semisal index yang disembunyikan ialah 0
                // dan nilai j ialah 0
                // maka langsung di alihkan ke throw Error
                var index_td = indexOfObject(arr_object,j);

                if(index_td === -1) throw Error('\nOps, undefined index "' + j + '"\nAre you hide this index/key?');

                if(this.json_search !== null)
                {
                    // variable index akan mengambil data array terakhir
                    // atau mengambil data object terakhir (primary_index)
                    index = is_array ? this.json_search[k][this.json_search[k].length - 1] : this.json_search[k]["primary_index"];
                    // mengganti data ke yang baru
                    this.json_search[k][j] = find[j];   
                }
                // mengganti data ke yang baru
                this.json[index][j] = find[j];
                
                var json = this.json_search === null ? this.json : this.json_search;
                
                // jika memasukkan option change (untuk merubah saat render)
                td[index_td + after_th].innerHTML = (this.update_row && typeof this.update_row[j] !== 'undefined') 
                                                        ? this.update_row[j](this.__setParameters(json[k])) 
                                                        : find[j];
                
            }

            index_find++;
        }
        
    }

    /**
     * shhowConfirm()
     * untuk menampilkan confirm
     * 
     * isi dari OBJ
     * type : ["warning", "danger", "info", "success"]
     * title: default "INFO"
     * info : default "Info Confirm"
     * accept_text : "Yes"
     * abort_text : "No"
     * callback_accept = private function untuk tombol YES
     * callback_abort  = private function untuk tombol NO
     */
    arjunane_table.prototype.showConfirm = function (obj, callback_accept, callback_abort)
    {
        var arr_type    = ["warning", "danger", "info", "success"];

        var type        = obj.type && ( obj.type === "warning" || obj.type === "danger" || obj.type === "info" || obj.type === "success") ? obj.type : "info";

        var alert_confirm = this.container[0].getElementsByClassName("--at-confirm-container")[0];
        // menghapus semua class yang ada di alert_confirm
        // sesuai dengan array dari arr_type
        for(var i = 0; i < arr_type.length; i++)
        {
            alert_confirm.classList.remove(arr_type[i]);
        }
        
        // menambahhkan class pada alert_confirm sesuai dengan obj.type
        alert_confirm.classList.add(type);

        var title       = obj.title || "INFO",
            text        = obj.text || "Info Confirm",
            accept_text = obj.accept_text || "Yes",
            abort_text  = obj.abort_text || "No";
        
        alert_confirm.classList.add("aktif");
        
        alert_confirm.getElementsByClassName("--at-alert-top")[0].children[0].innerHTML = title;
        alert_confirm.getElementsByClassName("--at-alert-middle")[0].innerHTML = text;
        alert_confirm.getElementsByTagName("button")[0].innerHTML = accept_text;
        alert_confirm.getElementsByTagName("button")[1].innerHTML = abort_text;

        // jika callback accept dan abort ialah function
        // maka this.accept_alert dan this.abort_alert akan di timpa dengan private function dari callback
        if(typeof callback_accept === 'function') this.accept_confirm = callback_accept;
        if(typeof callback_abort === 'function') this.abort_confirm = callback_abort;
    }

    /**
     * showAlert()
     * untuk menampilkan confirm
     * 
     * isi dari OBJ
     * type : ["warning", "danger", "info", "success"]
     * title: default "INFO"
     * info : default "Info Confirm"
     * button_text : "OK"
     */
    arjunane_table.prototype.showAlert = function (obj)
    {
        var arr_type    = ["warning", "danger", "info", "success"];

        var type        = obj.type &&( obj.type === "warning" || obj.type === "danger" || obj.type === "info" || obj.type === "success") ? obj.type : "info";

        var alert_confirm = this.container[0].getElementsByClassName("--at-alert-alert")[0];
        // menghapus semua class yang ada di alert_confirm
        // sesuai dengan array dari arr_type
        for(var i = 0; i < arr_type.length; i++)
        {
            alert_confirm.classList.remove(arr_type[i]);
        }
        
        // menambahhkan class pada alert_confirm sesuai dengan obj.type
        alert_confirm.classList.add(type);

        var title       = obj.title || "INFO",
            text        = obj.text || "Info Alert",
            button_text = obj.button_text || "OK";
        
        alert_confirm.classList.add("aktif");
        
        alert_confirm.getElementsByClassName("--at-alert-top")[0].children[0].innerHTML = title;
        alert_confirm.getElementsByClassName("--at-alert-middle")[0].innerHTML = text;
        alert_confirm.getElementsByTagName("button")[0].innerHTML = button_text;
    }

    /**
     * clearChecked
     * digunakan untuk membersihkan table dari pilihan input checkbox
     */
    arjunane_table.prototype.clearChecked = function ()
    {
        if(this.json !== null && this.isCheckable)
        {
            var container = this.container[0],
                checkboxs = container.getElementsByTagName("tbody")[0].getElementsByClassName("--at-check-box");
            for(var i = (checkboxs.length - 1); i >= 0; i--)
            {
                var tr = checkboxs[i].parentElement.parentElement;
                var index = parseInt(checkboxs[i].value);
                checkboxs[i].checked = false;
                this.__removeCheckData(index);
                tr.classList.remove("aktif");
            }
        }
    }

    /**
     * getChecked
     * untuk mendapatkan data_checked dan index_checked
     * return { data_checked , indexs }
     */
    arjunane_table.prototype.getCheckedData = function ()
    {
        var indexs        = new Array(),
            data_checked  = new Array();
        if(this.index_checked.length > 0)
        {
            for(var i = 0; i < this.index_checked.length; i++)
            {
                if(typeof this.index_checked[i] !== 'undefined')
                {
                    indexs.push(this.index_checked[i]);
                    data_checked.push(this.data_checked[i]);
                }
            }
        }
        return { indexs : indexs, data_checked : data_checked };
    }

    /**
     * getData
     * untuk mendapatkan data json
     * return json object/array
     */
    arjunane_table.prototype.getData = function ()
    {
        return this.json;
    }

    /**
     * getCurrentData
     * untuk mendapatkan data json hasil pencarian atau halaman saat ini
     * contoh :
     * mendapatkan data seluruh data di halaman 1 
     * dimana halaman saat ini ialah halaman 1
     * return json object/array
     */
    arjunane_table.prototype.getCurrentData = function ()
    {
        var gd      = global_data[this.index],
            data    = new Array(),
            json    = this.json_search === null ? this.json : this.json_search,
            start   = (gd['current_page'] - 1) * gd["per_page"];
        for(var i = start; i < json.length; i++)
        {
            data.push(this.__setParameters(json[i]));
            /**
             * semisal current_page (halaman saat ini) ialah 1
             * dan per_page (per halaman) ialah 10
             * maka 1 * 10 = 10
             * 
             * jika i + 1 sama dengan 10 : berhenti
             */
            if((gd["current_page"] * gd["per_page"]) === (i + 1)) break;
        }
        return data;
    }

    /**
     * getAllCurrentData
     * mendapatkan seluruh data dari hasil pencarian (filter)
     * maupun dari hasil pengurutan
     */
    arjunane_table.prototype.getAllCurrentData = function ()
    {
        var data    = new Array(),
            json    = this.json_search === null ? this.json : this.json_search;
        for(var i = 0; i < json.length; i++)
        {
            data.push(this.__setParameters(json[i]));
        }
        return data;
    }

    /**
     * isJSON
     * digunakan untuk validasi apakah string bisa di parse menjadi JSON
     * return boolean
     */
    arjunane_table.prototype.isJSON = function (str)
    {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    function indexOfObject(obj, value)
    {
        for(var i in obj)
        {
            if(obj[i] === value) return parseInt(i);
        }
        return -1;
    }

    function isDate(value)
    {
        return value instanceof Date && !isNaN(value.valueOf());
    }

    function isNumeric(value)
    {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }
    function trim(value) 
    {
        return value.replace(/^\s+|\s+$/gm,'');
    }

    function isExist(json, index)
    {
        return typeof json[index] !== 'undefined' ? true : false;
    }

    function IsJsonString(str) 
    {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    window.arTable = new arjunane_table;

})(window);