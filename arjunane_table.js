(function (window) {

    "use strict";

    var global_index    = 0,
        global_data     = {};

    if (typeof Array.isArray === 'undefined') {
        Array.isArray = function(obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        }
    };
    // https://tc39.github.io/ecma262/#sec-array.prototype.find
    if (!Array.prototype.find) {
        Object.defineProperty(Array.prototype, 'find', {
        value: function(predicate) {
            // 1. Let O be ? ToObject(this value).
            if (this == null) {
            throw TypeError('"this" is null or not defined');
            }
    
            var o = Object(this);
    
            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;
    
            // 3. If IsCallable(predicate) is false, throw a TypeError exception.
            if (typeof predicate !== 'function') {
            throw TypeError('predicate must be a function');
            }
    
            // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
            var thisArg = arguments[1];
    
            // 5. Let k be 0.
            var k = 0;
    
            // 6. Repeat, while k < len
            while (k < len) {
            // a. Let Pk be ! ToString(k).
            // b. Let kValue be ? Get(O, Pk).
            // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
            // d. If testResult is true, return kValue.
            var kValue = o[k];
            if (predicate.call(thisArg, kValue, k, o)) {
                return kValue;
            }
            // e. Increase k by 1.
            k++;
            }
    
            // 7. Return undefined.
            return undefined;
        },
        configurable: true,
        writable: true
        });
    }
    if (!Array.prototype.indexOf)
        Array.prototype.indexOf = (function(Object, max, min) {
            "use strict"
            return function indexOf(member, fromIndex) {
            if (this === null || this === undefined)
                throw TypeError("Array.prototype.indexOf called on null or undefined")

            var that = Object(this), Len = that.length >>> 0, i = min(fromIndex | 0, Len)
            if (i < 0) i = max(0, Len + i)
            else if (i >= Len) return -1

            if (member === void 0) {        // undefined
                for (; i !== Len; ++i) if (that[i] === void 0 && i in that) return i
            } else if (member !== member) { // NaN
                return -1 // Since NaN !== NaN, it will never be found. Fast-path it.
            } else                          // all else
                for (; i !== Len; ++i) if (that[i] === member) return i 

            return -1 // if the value was not found, then return -1
            }
    })(Object, Math.max, Math.min);

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
        this.version                    = "1.0.1";
        this.github                     = "https://github.com/dimas-ak/";
        this.documentation_server_1     = "https://dimas-ak.web.app/documentation/arjunane-table";
        this.documentation_server_2     = "https://dimas-ak.github.io/documentation/arjunane-table/";
        this.developed_by               = "Dimas Awang Kusuma";
        this.facebook                   = "https://www.facebook.com/arjunane.co.id";
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
        this.insert_column  = null;
        this.max_page       = 0;

        this.data          = new Array();

        this.last_id_inserted  = 0;

        this.total_inserted = 0;

        this.removed_index  = new Array();

        this.accept_confirm = function () {};
        this.abort_confirm  = function () {};

        this.on_complete    = function () {};
        this.on_change      = function () {};
        this.on_next_page   = function () {};
        this.on_prev_page   = function () {};
        this.on_jump_page   = function () {};
        this.on_showing     = function () {};
        this.on_filter      = function () {};
        this.on_page_change = function () {};
        this.on_row         = null;
        this.on_tbody      = null;

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
            arr_search_type : {},
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

        var url = null;

        if(obj)
        {
            this.isCheckable    = obj.checkable || false;
            this.isNumeric      = obj.numeric || false;
            this.action         = obj.action;
            this.popup_action   = obj.popup_action;
            this.hide           = obj.hide || new Array();
            this.is_scrolled    = obj.scrollable || this.is_scrolled;
            this.height         = obj.height || this.height;
            this.thead          = obj.thead || this.thead;
            // this.on_complete    = obj.on_complete || this.on_complete;
            this.update_row     = obj.update_row || {};
            this.insert_column  = obj.insert_column || null;
            
            if(obj && !obj.url && !obj.data && !isReplace) throw Error('\nPlease, at least set "url" or "data"');

            url = obj.url;
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
            if(!obj.data)
            {
                this.req(url, function (data) {

                    if(data.error === null && IsJsonString(data.result))
                    {
                        self.on_complete();
    
                        appendData(self, data, JSON.parse(data.result));
    
                        if(self.insert_column) self.__changeColumn();
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
                if(Array.isArray(self.data))
                {
                    //this.json = obj.array;

                    var last = performance.now();
                    dt["time"] = ((last - now % 60000) / 1000).toFixed(2);

                    appendData(self, dt, obj.data);
        
                    self.on_complete();

                    if(self.insert_column) self.__changeColumn();
                }
                else
                {
                    var msg =   "<strong>Selector</strong> : " + self._str_selector + "<br>" +
                                "<strong>Messages</strong> : <br>" + "Data not valid";
    
                    self.showAlert({
                        type    : "danger", 
                        title   : "Ops, something went wrong !",
                        text    : msg
                    });
                }
                
            }
            
        }
        else
        {
            var last = performance.now();

            dt["time"] = ((last - now % 60000) / 1000).toFixed(2);

            appendData(self, dt, this.json)
            self.on_complete();
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
        
        if(data !== null)  self.__normalizeData(json);
        
        self.__setResult(data === null ? null : data.time);

        self.__setPagination();

        if(json.length === 0)
        {
            var length = self.thead.length;
            var innerHTML = container.getElementsByTagName("tbody")[0];
            innerHTML.innerHTML += '<tr><td style="text-align:center" colspan="' + length + '">Ops, Your Data is NULL</td></tr>';
        }
        else
        {
            self.__setTbody( data !== null ? true : undefined);

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

                self.on_jump_page();
                self.on_page_change();
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

                    var key = evt - minus;
                    
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

                    self.on_prev_page();
                    self.on_page_change();
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

                    self.on_next_page();
                    self.on_page_change();
                }
            });

            // select option show per_page
            container.getElementsByClassName("--select-show")[0].addEventListener("change", function () {
                self.__getResultShow(this.value);
                self.__setResult();
                self.__setPagination();
                self.__setTbody();

                self.on_showing();
                this.on_page_change();
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
                                var data = {};
                                // periksa terlebih dahulu apakah data_checked[p] bernilai undefined
                                // karena index nya bernilai tidak urut
                                // karena user memilih checkbox nya secara acak
                                // semisal user memilih tr > td checkbox
                                // 0 [...data...] 
                                // 2 [...data...] 
                                // 4 [...data...] 
                                // kemudian di normalisasikan melalui validasi apakah bernilai undefined?
                                // jika tidak bernilai undefined, maka akan di masukkan/push ke variable params
                                if(typeof self.data_checked[p] !== 'undefined')
                                {
                                    params.push(self.__setData(self.data_checked[p]));
                                }
                            }
                            
                        }
                        var url = typeof action.params !== 'undefined' ? href + action.params(params) : href; 
                        // jika listener ada
                        //if(typeof action.listener === 'function') action.listener(params, evt, self.index_checked, this);
                        if(typeof action.listener === 'function') action.listener(params, evt, this);
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
    arjunane_table.prototype.__setTbody = function (isFirst)
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
                            // var params = _self.__setParameters(tmp_json[i]),
                            //     value  = parseInt(this.getAttribute("value")); // mendapatkan nilai dari attribute value pada setiap a-href action di last-td
                            if(typeof act[t].listener !== 'undefined') return act[t].listener(_self.__setData(tmp_json[i]), evt, this);
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
                            // var params = _self.__setParameters(tmp_json[i]),
                            //     value  = parseInt(this.getAttribute("value")); // mendapatkan nilai dari attribute value pada setiap a-href action di last-td
                            if(typeof act[t].listener !== 'undefined') return act[t].listener(_self.__setData(tmp_json[i]), evt, this);
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
                    
                    if(_self.data_checked.length === 0)
                    {
                        _self.container[0].getElementsByClassName('--at-checkbox-container')[0].checked = false;
                    }
                });
            }
        }
        
        // jika arTable.on("row", function) di set dan data dari tmp_json tidak sama dengan 0z 
        if(this.on_row !== null && tmp_json.length > 0)
        {
            var td = this.container[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr");
            
            for(var i = 0; i < td.length; i++)
            {
                var json = tmp_json[i];
                var parent = td[i];
                //var index  = is_array ? json[json.length - 1] : json["primary_index"];
                // index : menyesuaikan urutan data (index) dari json awal (saat pertama kali init)
                // i : merupakan urutan dari setiap tr pada tbody
                //this.on_row(parent, this.__setParameters(json), index, i);
                this.on_row(parent, this.__setData(json), i);
            }
        }

        // jika arTable.on("column", function) di set dan data dari tmp_json tidak sama dengan 0z
        if(this.on_tbody !== null && tmp_json.length > 0)
        {
            var tbody = this.container[0].getElementsByTagName("tbody")[0];
            
            this.on_tbody(tbody);
        }

        // jika bukan pertama kali __setTbody
        // maka this.on_change event akan tereksekusi
        // hal ini untuk menghindari duplikasi event dari this.on_change
        // saat pertama kali init
        if(typeof isFirst === 'undefined') this.on_change();
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
        if(this.data_checked.length === 1)
        {
            this.data_checked = new Array();
            this.index_checked = new Array();
            return;
        }
       this.data_checked.splice(index, 1);
       this.index_checked.splice(index, 1);
    }

    arjunane_table.prototype.__setData = function (data)
    {
        var is_array = global_data[this.index]["is_array"];
        var dt = {};

        dt["key"]   = is_array ? data[data.length - 1] : data["primary_index"];
        dt["data"]  = this.__setParameters(data);

        return dt;
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
                                _self.filter(value, ini.for_key, ini.filter_type);
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
                                _self.filter(value, ini.for_key, ini.filter_type);
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

        var filter      = "io";
        var gd          = global_data[this.index];
        var tmp_json    = new Array();

        if(typeof _filter !== 'undefined') filter = validationFilterSearches(_filter);

        var index = gd["is_array"] ? parseInt(_for) : _for;

        var value = _value.length === 0 ? null : _value;

        if(typeof gd["arr_search"][index] === 'undefined') throw Error('\nUndefined index or key for : ' + index);

        var arr_search      = gd["arr_search"],
            arr_search_type = gd["arr_search_type"],
            length_value    = 0;

        // jika _for tidak sama dengan * (semua index)
        if(_for !== "*")
        { 
            gd["arr_search"][index] = value;

            arr_search_type[_for] = filter;
        }
        else
        {
            arr_search_type = {};
        }
        
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
                    // if(value !== null && data[key].toString().indexOf(value) !== -1) tmp_json.push(data);
                    if(value !== null && isFindSearches(value, data[key], filter) ) tmp_json.push(data);
                }
            }
            else
            {
                for(var key in arr_search)
                {
                    // jika arr_search sesuai key tidak null
                    // dimana jika null berarti tidak ada yang perlu di cari
                    // if(arr_search[key] !== null && data[key].toString().indexOf(arr_search[key]) !== -1) isFound += 1;
                    if(arr_search[key] !== null && isFindSearches(arr_search[key], data[key], arr_search_type[key] )) isFound += 1;
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
        this.__setTbody();

        this.on_filter();
    }

    function validationFilterSearches(filter)
    {
        var arr = ['io', 'gt', 'lt', 'gte', 'lte', 'eq'];
        for (var i = 0; i < arr.length; i++) {
            var ini = arr[i];
            if(filter === ini) return ini;
        }
        return arr[0];
    }

    function isFindSearches(value_input, value_key, filter)
    {
        if(filter === "io" && value_key.toString().indexOf(value_input) !== -1) return true;
        else if(
            (filter === "gt" && parseFloat(value_key) > parseFloat(value_input)) || 
            (filter === "gte" && parseFloat(value_key) >= parseFloat(value_input))
            ) return true;
        else if(
            (filter === "lt" && parseFloat(value_key) < parseFloat(value_input)) || 
            (filter === "lte" && parseFloat(value_key) <= parseFloat(value_input))
            ) return true;
        else if(filter === "eq" && value_input.toString() === value_key.toString()) return true;
        return false;
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
        
        this.max_page = pages;
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

            var selected = select.getElementsByTagName("option")[gd["current_page"] - 1]
            if(typeof selected === 'undefined') return; 
            selected.selected = 'selected=""';

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
                
                if(!is_array && typeof _json["primary_index"] !== 'undefined')
                throw Error('\nOps, please do not use the word "primary_index" on your data');

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

        this.last_id_inserted = _json.length;
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
        
        this.total_inserted = 0;
        this.json_search = copy_json;
    }


    arjunane_table.prototype.req    = function (url, callback)
    {
        var xhttp = new (XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0'),
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

        if(!Array.isArray(_index)) remove_json.push(_index);
        else remove_json    =   _index;
        
        
        var json_search = this.json_search,
            json = this.json;
        
        /**
         * mengurutkan index / key
         * dari terkecil sampai ke yang terbesar
         */
        if(remove_json.length > 1)
        {
            remove_json.sort( function (a, b) {
                return a - b;
            });
        }
        
        /**
         * jika json_search / hasil pencarian (filter) atau pengurutan
         * tidak sama dengan null
         * maka akan di cari index (tr) sesuai data yang ingin di hapus
         * 
         * karena this.json_search dan this.json (jika kedua nya tidak bernilai null)
         * mempunyai data yang berbeda
         * 
         * contoh data dari this.json :
         * ["Mencoba Nama",     50]  = index 0
         * ["Mencoba asiyap",   60]  = index 1
         * ["Mencoba oke",      90]  = index 2
         * ["Mencoba alright",  70]  = index 3
         * ["Mencoba tamvan",   40]  = index 4
         * 
         * dan yang di cari (filter) ialah nilai yang lebih dari 60
         * maka data dari this.json_search
         * ["Mencoba asiyap",   60]  = index 0
         * ["Mencoba oke",      90]  = index 1
         * ["Mencoba alright",  70]  = index 2
         */
        if(json_search !== null)
        {
            // penyimpanan sementara index dari data yang akan dihapus
            // sesuai dengan key
            var find_index = new Array();
            // mencari data sesuai halaman yang dipilih di dalam pencarian (filter)
            for(var i = pages; i < gd["current_page"] * gd["per_page"]; i++)
            {
                var data = json_search[i];

                // biasanya halaman terakhir memiliki data 
                // yang sedikit
                // contoh :
                // ada 3 halaman dan data yang ditampilkan ialah 10 per_page
                // kemudian di halaman ke tiga hanya ada 3 data yang dapat ditampilkan
                // berarti 3 data terakhir itu kurang dari per_page
                // dimana per_page ialah 10 data
                if(typeof data === 'undefined') break;

                var key = is_array ? data[data.length - 1] : data["primary_index"];
                // jika ada
                if(remove_json.indexOf(key) !== -1) find_index.push(i);
                
                // jika panjang dari find_index sama dengan remove_json
                // maka looping akan dihentikan
                if(find_index.length === remove_json.length) break;
            }

            // menghapus data dari yang terbesar ke yang terkecil
            // sesuai index
            for(var i = (find_index.length - 1); i >= 0; i--)
            {
                var index = find_index[i];
                json_search.splice(index, 1);
            }
        }
        
        // penyimpanan sementara index dari data yang akan dihapus
        // sesuai dengan key
        // find_index_json untuk seluruh data 
        var find_index_json = new Array();
        json.find( function (data, i) {

            var key = is_array ? data[data.length - 1] : data["primary_index"];
            // jika ada
            if(remove_json.indexOf(key) !== -1) find_index_json.push(i);
            
            // jika panjang dari find_index_json sama dengan remove_json
            // maka looping akan dihentikan
            if(find_index_json.length === remove_json.length) return true;
        });
        
        // menghapus data dari yang terbesar ke yang terkecil
        // sesuai index
        for(var i = (find_index_json.length - 1); i >= 0; i--)
        {
            var index = find_index_json[i];
            json.splice(index, 1);
        }
        this.__setResult();
        this.__setTbody();
        this.__setPagination();

    }

    /**
     * 
     * @param {*} key : string || integer
     * @param {*} obj 
     * 
     * updateColumn 
     * digunakan untuk meng-update semua column (dari atas sampai bawah)
     * 
     * Object keys:
     * 
     ** thead : string
     ** key   : string || integer
     ** value : function -> return
     ** html  : function -> return string
     */
    arjunane_table.prototype.updateColumn = function (key, obj)
    {
        var gd          = global_data[this.index],
            is_array    = gd["is_array"],
            arr_object  = gd["arr_object"],
            json        = this.json;

        if(typeof key !== 'undefined' && typeof obj !== 'undefined' && typeof json.length !== 'undefined' && json.length > 0)
        {
            var addHtmlFunction = true; 
            for(var i = 0; i < json.length; i++)
            {
                var ini = json[i];
                
                // validasi :
                // -> jika data dari 'key' tidak ada
                // -> jika data JSON berupa array dan key sama dengan panjang dari panjang object JSON yang di looping (sama dengan primary_index)
                if(typeof ini[key] === 'undefined' || (is_array && parseInt(key) === ini.length) || (!is_array && key === 'primary_index'))
                throw Error('\nCannot find data for "' + key + '" on updateColumn');

                var k = is_array ? parseInt(key) : key;

                var value = obj.value ? obj.value(this.__setParameters(ini)) : ini[k];
                
                ini[k] = value;

                if(typeof obj.html !== 'undefined' && addHtmlFunction) 
                {
                    this.update_row[k] = obj.html;
                }

                addHtmlFunction = false;
            }

            this.__changeColumn(true);
        }
    }

    /**
     * 
     * @param {array} columns
     * deleteColumn digunakan untuk menghapus sejumlah column 
     */
    arjunane_table.prototype.deleteColumn = function (columns)
    {
        var gd          = global_data[this.index],
            is_array    = gd["is_array"],
            arr_object  = gd["arr_object"],
            json        = this.json;
            
        if(columns && typeof columns.length !== 'undefined' && typeof json.length !== 'undefined' && json.length > 0)
        {
            
            for(var i = 0; i < json.length; i++)
            {
                var ini = json[i];
                for(var c = columns.length - 1; c >= 0; c--)
                {
                    var key = columns[c];
                    // validasi :
                    // -> jika data dari 'key' tidak ada
                    // -> jika data JSON berupa array dan key sama dengan panjang dari panjang object JSON yang di looping (sama dengan primary_index)
                    if(typeof ini[key] === 'undefined' || (is_array && parseInt(key) === ini.length) || (!is_array && key === 'primary_index'))
                    throw Error('\nCannot find data for "' + key + '" on deleteColumn');

                    // if(this.__isHide(key))
                    // throw Error('\nCannot delete hidden column [key : "' + key + '"] on deleteColumn');
                    
                    if(is_array) ini.splice(parseInt(key), 1);
                    else delete ini[key];
                }
            }
            
            var newArrSearch    = {},
                newArrObject    = {},
                exceptThead     = new Array(), // untuk menghapus thead
                index           = 0;

            // menghapus input pencarian
            // dan menghapus beberapa key/index di dalam arr_object
            // dimana arr_object itu hanya berisi key/index yang tidak ter-hide
            for(var i in arr_object)
            {
                var is_find = false;
                var key_object = arr_object[i];
                for(var c = 0; c < columns.length; c++)
                {
                    var key = columns[c];
                    // jika key_object dari arr_object sama dengan key yang akan di hapus (dari columns)
                    if(key_object === key.toString()) 
                    {
                        // menghapus arr_search_type berdasarkan key yang akan dihapus
                        if(typeof gd["arr_search_type"][key.toString()] !== 'undefined') delete gd["arr_search_type"][key.toString()];

                        index++;
                        // jika key tidak termasuk yang ter-hide
                        // maka akan ditambahkan ke exceptThead 
                        // karena value index/key yang disembunyikan tidak termasuk/ditampilkan ke thead
                        if(!this.__isHide(key)) exceptThead.push(i);
                        is_find = true; 
                        break;
                    }
                }

                // jika key/index tidak ditemukan maka
                // arr_search (input pencarian) akan dihapus (dibuat null semua)
                // arr_object akan diatur ulang menyesuaikan value yang ter-hide (jika ada)

                // jika tidak ada yang sama antara key atau index yang akan dihapus
                if(!is_find) 
                {
                    var _index = i - index;
                    // membuat arr_search yang baru dan menyesuaikan index atau key yang telah terhapus
                    newArrSearch[_index] = null;
                    // jika data json ialah array
                    // maka value dari arr_object ialah _index itu sendiri
                    // jika tidak maka
                    // key_object yang berupa string
                    newArrObject[_index] = is_array ? _index.toString() : key_object.toString();
                }
            }
            
            // menghapus thead tertentu sesuai dengan index atau key yang dihapus
            for(var t = exceptThead.length - 1; t >= 0; t--)
            {
                var index = exceptThead[t];
                if(this.__isHide(index)) break;
                this.thead.splice(index, 1);
            }

            // jika data yang dihapus masuk ke data yang ter-hide
            // maka data yang ter-hide tersebut akan di hapus juga
            for(var h = this.hide.length - 1; h >= 0; h--)
            {
                var key = this.hide[h];
                // jika kondisi array dari hide mempunyai panjang berupa 0
                // maka looping akan dihentikan
                if(this.hide.length === 0) break;

                for(var c = 0; c < columns.length; c++)
                {
                    var key_column = columns[c];
                    if(key.toString() === key_column.toString()) this.hide.splice(h, 1);
                }
            }
            
            gd["arr_search"] = newArrSearch;
            gd["arr_object"] = newArrObject;
        }

        this.__changeColumn(true);
    }

    /**
     * __changeColumn
     * digunakan untuk menambahkan atau meng-update column
     * berdasarkan jumlah yang ingin ditambahkan
     */
    arjunane_table.prototype.__changeColumn = function (isDeleteOrUpdate)
    {
        // jika menambahkan sejumlah column atau dengan kata lain bukan menghapus sejumlah column dan meng-update sejumlah column
        if(typeof isDeleteOrUpdate === 'undefined') this.__insertColumnInitialized(this.insert_column);
        
        this.__setTable();

        this.container = document.getElementsByClassName(this.str_selector);

        this.__setFormFilters();

        var gd      = global_data[this.index],
            self    = this;

        listenerToAlert(self, this.container[0]);
        
        appendData(self, null, self.json);
    }

    /**
     * __insertColumnInitialized
     * digunakan untuk menambah data (column/ atas kebawah)
     * Object keys:
     * 
     ** thead : string
     ** key   : string || integer
     ** value : function -> return
     ** html  : function -> return string
     */
    arjunane_table.prototype.__insertColumnInitialized = function (columns)
    {

        var json        = this.json,
            _self       = this,
            gd          = global_data[this.index],
            is_array    = gd["is_array"];

        if(columns && typeof columns.length !== 'undefined')
        {
            if(json.length > 0)
            {
                insertColumnInitialized(json, columns, is_array, _self);
            }
        }
    }

    function insertColumnInitialized(json, columns, is_array, self)
    {
        var addHtmlFunction = true; 
        for(var i = 0; i < json.length; i++)
        {
            var ini     = json[i],
                length  = is_array ? ini.length - 1: null;
            for(var c = 0; c < columns.length; c++)
            {
                var col = columns[c];
                // jika "key" tidak di isi dan type dari json ialah array of object
                if(typeof col.key === 'undefined' && !is_array) 
                throw Error('\nPlease set parameters for "key" on insert_column or insertColumn');
                
                // jika "key" sudah ada sebelumnya dan type dari json ialah array of object
                if(!is_array && typeof ini[col.key] !== 'undefined')
                throw Error('\nOps data with key/index of "' + col.key + '" is exist on insert_column or insertColumn');

                if(!is_array && typeof ini[col.key] !== 'undefined' && col.key === 'primary_index')
                throw Error('\nOps, please do not use the word "primary_index" on insert_column or insertColumn');

                var value = col.value ? col.value(self.__setParameters(ini)) : "";
                
                if(is_array) ini.splice( (length + c), 0, value);
                else ini[col.key] = value;

                if(typeof col.html !== 'undefined' && addHtmlFunction) 
                {
                    var key = is_array ? (length + c) : col.key;
                    self.update_row[key] = col.html;
                }
            }

            addHtmlFunction = false;
            // throw Error('\nOps, undefined index "' + j + '"\nAre you hide this index/key?');
        }

        var gd          = global_data[self.index];

        // menambahkan key index untuk pencarian dan mengkosongkan string atau kata kunci pencarian
        for(var search in gd["arr_search"])
        {
            gd["arr_search"][search] = null;
        }
        
        // menambahkan key index untuk order by
        var lengthArrObject = lengthOfObject(gd["arr_object"]);
        for(var i = 0; i < columns.length; i++)
        {
            var col = columns[i];
            var key = is_array ? lengthArrObject + i : col.key;
            gd["arr_object"][lengthArrObject + i] = key;
        }

        if(typeof self !== 'undefined')
        {
            // menambahkan thead
            for(var c = 0; c < columns.length; c++)
            {
                var col = columns[c];
                var thead = col.thead || "";
                self.thead.push(thead);
                
            }
        }
        
    }

    /**
     * @param {*} columns 
     * 
     * insertColumn
     * 
     * digunakan untuk menambah data (column/ atas kebawah)
     * columns keys:
     * 
     ** thead : string
     ** key   : string || integer
     ** value : function -> return
     ** html  : function -> return string
     */
    arjunane_table.prototype.insertColumn = function (columns)
    {
        this.__insertColumnInitialized(columns);
        this.__changeColumn(true);
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
            this.last_id_inserted += 1;
            var length  = this.last_id_inserted;

            // menerapkan primary_index atau key di akhir array/index
            is_array ? dt.push(length) : dt["primary_index"] = length;

            if(this.json_search !== null) 
            {
                new_data_search.push(dt);
            }

            new_data.push(dt);
        }
        
        this.total_inserted += new_data.length;

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

        var json_search = this.json_search;            
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

        // untuk menyimpan data key
        var arr_find_json = new Array();
        // untuk menyimpan data key dari hasil pencarian / order by
        var arr_find_json_search = new Array();
        
        if(json_search !== null)
        {
            // menyesuaikan data sesuai halaman yang sedang di tampilkan
            for(var i = pages; i < gd["current_page"] * gd["per_page"]; i++)
            {
                var data = json_search[i];
                var _key = is_array ? data[data.length - 1] : data["primary_index"];
                // jika ada
                if(update_json.indexOf(_key) !== -1) arr_find_json_search.push(i);
                
                // jika panjang arr_find_json_search sama dengan update_json
                if(arr_find_json_search.length === update_json.length) break;
            }
        }
        
        this.json.find( function (data, i) {
            var _key = is_array ? data[data.length - 1] : data["primary_index"];
            if(update_json.indexOf(_key) !== -1) arr_find_json.push(i);
            
            if(arr_find_json.length === update_json.length) return true;
        });
        
        // pengurutan dari update_json ialah
        /**
         * misal data array
         * 0 : 0
         * 2 : 2
         * 3 : 3
         * 5 : 5
         * 7 : 7
         */
        for(var i = 0; i < arr_find_json.length; i++)
        {
            var k       = arr_find_json[i];

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
            
            var index_tr = this.json_search !== null ? arr_find_json_search[i] : arr_find_json[i];
            
            // k - pages
            // jika k mempunyai nilai 2
            // dan pages bernilai 0
            // maka index tr ialah ke 2
            // atau jika k mempunyai nilai 22
            // dan hasil perkalian dari pages ((current_page - 1) * per_page || (halaman ke 3 - 1) * 10 per page) = 20
            // jadi 22 - 20 = 2
            // maka index tr yang akan di update ialah 2
            var td      = tr[index_tr].getElementsByTagName("td");
            
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
                    // mengganti data ke yang baru
                    this.json_search[ arr_find_json_search[i] ][j] = find[j];
                }
                // mengganti data ke yang baru
                this.json[ arr_find_json[i] ][j] = find[j];
                
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
                checkboxs = container.getElementsByTagName("tbody")[0].getElementsByClassName("--at-check-box"),
                main_checkbox = container.getElementsByClassName('--at-checkbox-container')[0];
            main_checkbox.checked = false;
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
        // var indexs        = new Array(),
        //     data_checked  = new Array();
        var data_checked = new Array();
        if(this.index_checked.length > 0)
        {
            for(var i = 0; i < this.index_checked.length; i++)
            {
                if(typeof this.index_checked[i] !== 'undefined')
                {
                    var data = {};
                    data["key"] = this.index_checked[i];
                    data['data'] = this.__setParameters(this.data_checked[i]);
                    data_checked.push(data);
                    // indexs.push(this.index_checked[i]);
                    // data_checked.push(this.__setParameters(this.data_checked[i]));
                }
            }
        }
        // return { indexs : indexs, data_checked : data_checked };
        return data_checked;
    }

    /**
     * getData
     * untuk mendapatkan data json
     * return json object/array
     */
    arjunane_table.prototype.getData = function ()
    {
        var newJson = new Array(),
            is_array = global_data[this.index]["is_array"];
        for(var i = 0; i < this.json.length; i++)
        {
            var ini = this.json[i];
            var data = {};
            data["key"] = is_array ? ini[ini.length - 1] : ini["primary_index"];
            data["data"] = this.__setParameters(ini);
            newJson.push(data);
            //newJson.push(this.__setParameters(this.json[i]))
        }
        return newJson;
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
            indexs  = new Array(),
            is_array= gd["is_array"],
            json    = this.json_search === null ? this.json : this.json_search,
            start   = (gd['current_page'] - 1) * gd["per_page"];

        if(typeof json.length !== 'undefined' || json.length > 0)
        {
            for(var i = start; i < json.length; i++)
            {
                var ini = json[i];
                var dt = {};

                dt["key"] = is_array ? ini[ini.length - 1] : ini["primary_index"];
                dt["data"] = this.__setParameters(ini);
                data.push(dt);
               // data.push(this.__setParameters(json[i]));
                /**
                 * semisal current_page (halaman saat ini) ialah 1
                 * dan per_page (per halaman) ialah 10
                 * maka 1 * 10 = 10
                 * 
                 * jika i + 1 sama dengan 10 : berhenti
                 */
                if((gd["current_page"] * gd["per_page"]) === (i + 1)) break;
            }
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
        var data        = new Array(),
            is_array    = global_data[this.index]["is_array"],
            json        = this.json_search === null ? this.json : this.json_search;

        if(typeof json.length !== 'undefined' || json.length > 0)
        {
            for(var i = 0; i < json.length; i++)
            {
                var ini = json[i];
                var dt = {};

                dt["key"] = is_array ? ini[ini.length - 1] : ini["primary_index"];
                dt["data"] = this.__setParameters(ini);
                data.push(dt);
                //data.push(this.__setParameters(json[i]));
            }
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

    /**
     * 
     * @param {*} evt
     * @param {*} func
     * 
     * Memberi listener setiap ada perubahan data maupun saat selesai mendapatkan data
     */
    arjunane_table.prototype.on = function (evt, func)
    {
        // saat selesai mendapatkan data dari request server maupun saat dari init table
        if     (evt === "complete")    this.on_complete    = func;
        // saat data mengalami perubahan (dari ganti halaman atau pencarian, dsb)
        else if(evt === 'change')      this.on_change      = func;
        else if(evt === 'next_page')   this.on_next_page   = func;
        else if(evt === 'prev_page')   this.on_prev_page   = func;
        else if(evt === 'jump_page')   this.on_jump_page   = func;
        else if(evt === 'showing')     this.on_showing     = func;
        else if(evt === 'filter')      this.on_filter      = func;
        // saat data mengalami perubahan (saat ganti halaman)
        else if(evt === 'page_change') this.on_page_change = func;
        // untuk memberikan events di setiap row (tr) pada tbody
        else if(evt === "row")         this.on_row         = func;
        // untuk memberikan events di tbody
        else if(evt === "tbody")       this.on_tbody       = func;
    }

    arjunane_table.prototype.pages = function ()
    {
        var gd = global_data[this.index];
        var obj = {
            max_page        : this.max_page,
            per_page        : gd["per_page"],
            current_page    : gd["current_page"]
        };
        return obj;
    }

    /**
     * 
     * @param {*} arr digunakan untuk me-replace semua data JSON sebelumnya
     */
    arjunane_table.prototype.replace = function (arr)
    {
        var self = this;
        if(Array.isArray(arr))
        {
            var dt = {};
            global_data[this.index] = 
            {
                index           : global_index,
                data            : {},
                per_page        : 10,
                current_page    : 1,
                arr_search      : {},
                arr_search_type : {},
                arr_object      : null,
                order_by_index  : null,
                is_asc          : true,
            };

            appendData(self, null, arr);

            if(self.insert_column) self.__changeColumn();
        }
        else
        {
            var msg =   "<strong>Selector</strong> : " + self._str_selector + "<br>" +
                        "<strong>Messages</strong> : <br>" + "Data not valid";

            self.showAlert({
                type    : "danger", 
                title   : "Ops, something went wrong !",
                text    : msg
            });
        }
    }

    /**
     * nextPage
     * digunakan untuk mengganti data ke halaman berikutnya.
     */
    arjunane_table.prototype.nextPage = function ()
    {
        if(global_data[this.index]["current_page"] >= this.max_page) return;

        this.__getPagination(global_data[this.index]["current_page"] + 1);
        this.__setResult();
        this.__setPagination();
        this.__setTbody();

        this.on_next_page();
        this.on_page_change();
    }

    /**
     * prevPage
     * digunakan untuk mengganti data ke halaman sebelumnya.
     */
    arjunane_table.prototype.prevPage = function ()
    {
        if(global_data[this.index]["current_page"] <= 1) return;
        this.__getPagination(global_data[this.index]["current_page"] - 1);
        this.__setResult();
        this.__setPagination();
        this.__setTbody();

        this.on_next_page();
        this.on_page_change();
    }

    /**
     * jumpTo
     * digunakan untuk mengganti data ke halaman tertentu.
     */
    arjunane_table.prototype.jumpTo = function (_page)
    {
        var page = isNaN(parseInt(_page)) ? 1 : parseInt(_page);
        
        if(page < 1 || page > this.max_page) return;

        
        this.__getPagination(page);
                    
        this.__setResult();
        this.__setPagination();
        this.__setTbody();

        this.on_jump_page();
        this.on_page_change();
    }

    function lengthOfObject(obj)
    {
        var length = 0;
        for (var o in obj) length += 1;
        return length;
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